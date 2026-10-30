#!/usr/bin/env python3
"""Strips secrets from Playwright test results before they are uploaded as a
CI artifact.

Usage: python3 redact_test_results.py <test-results-dir>
"""
import json
import os
import re
import shutil
import sys
import xml.etree.ElementTree as ET
import zipfile

SECRET_ENV_VARS = [
    'RECOVERY_PHRASE_12_WORDS',
    'RECOVERY_PHRASE_24_WORDS',
    'PRIVATE_KEY_IMPORT',
    'PRIVATE_KEY_MAIN_EXT_WALLET',
    'XP_PRIVATE_KEY_MAIN_EXT_WALLET',
    'PASSWORD_KEYSTORE_V4',
    'PASSWORD_KEYSTORE_V6',
    'APITOKEN_CRYPTOAPIS',
    'APITOKEN_ETHERSCAN',
    'APITOKEN_GLACIER',
    'TESTRAIL_API_KEY',
]
# Only values that can appear unmasked on screen require media removal.
ON_SCREEN_SECRET_ENV_VARS = {
    'RECOVERY_PHRASE_12_WORDS',
    'RECOVERY_PHRASE_24_WORDS',
    'PRIVATE_KEY_IMPORT',
    'PRIVATE_KEY_MAIN_EXT_WALLET',
    'XP_PRIVATE_KEY_MAIN_EXT_WALLET',
}

TEXT_SUFFIXES = (
    '.md', '.txt', '.json', '.xml', '.html', '.css', '.js', '.log',
    '.trace', '.network', '.stacks',
)
MEDIA_SUFFIXES = ('.png', '.jpeg', '.jpg', '.webm')
EVALUATE_METHODS = {'evaluateExpression', 'evaluateExpressionHandle'}
REDACTED_VALUE = {'value': {'s': '[REDACTED]'}, 'handles': []}
INPUT_TAGS = {'INPUT', 'TEXTAREA'}
INPUT_VALUE_ATTRS = ('value', '__playwright_value_')
USER_DATA_PREFIX = 'user-data'
ATTACHMENT_DIR_RE = re.compile(r'\[\[ATTACHMENT\|([^/\]]+)/')
TYPING_TITLE_RE = re.compile(r'^((?:Fill|Type|Press sequentially) ")(.*?)(")', re.DOTALL)
TYPING_LOG_RE = re.compile(r'^(\s*(?:fill|type|pressSequentially)\(")(.*)("\)\s*)$', re.DOTALL)
INLINE_TYPING_RE = re.compile(
    r'((?:(?:Fill|Type|Press sequentially)\s+|'
    r'(?:fill|type|pressSequentially)\()(?:\\+)?")'
    r'([^"\\]*?)((?:\\+)?")'
)
ARIA_TEXTBOX_RE = re.compile(
    r'^(\s*- (?:textbox|searchbox)\b.*?: )("?)([^"\n]*)\2$', re.MULTILINE
)
# Element previews such as `locator resolved to <input value="...">` in call
# logs and errors, possibly JSON-escaped.
ELEMENT_PREVIEW_VALUE_RE = re.compile(
    r'(<(?:input|textarea)\b[^<>]*?\bvalue=(?:\\+)?")([^"\\]*)((?:\\+)?")'
)


class Redactor:
    def __init__(self, env):
        self.literals = {}
        self.words = {}
        for name in SECRET_ENV_VARS:
            value = env.get(name, '').strip()
            self.add_secret(name, value)

    def add_secret(self, name, value):
        if not value:
            return
        variants = {value}
        if value.startswith('0x'):
            variants.add(value[2:])
        for variant in list(variants):
            # Values also appear JSON-escaped, and double-escaped inside
            # step titles such as `Fill "<value>"`.
            escaped = json.dumps(variant)[1:-1]
            variants.update({escaped, json.dumps(escaped)[1:-1]})
        for variant in variants:
            self.literals.setdefault(variant, (name, f'[{name}]'))
        words = value.split()
        if len(words) > 1:
            for index, word in enumerate(words, start=1):
                self.words.setdefault(word, (name, f'[{name}#{index}]'))

    def literals_in(self, text, found):
        for literal in sorted(self.literals, key=len, reverse=True):
            if literal in text:
                name, label = self.literals[literal]
                found.add(name)
                text = text.replace(literal, label)
        return text

    def typed_value(self, value, found):
        # Recovery phrases are typed one word per input. Single words are only
        # redacted where typed values live: matching them anywhere would hit
        # unrelated text and, through the positional label, reveal the word.
        if value in self.words:
            name, label = self.words[value]
            found.add(name)
            return label
        return self.literals_in(value, found)


def redact_snapshot_inputs(node, redactor, found):
    if isinstance(node, list):
        if (
            len(node) > 1
            and isinstance(node[0], str)
            and node[0] in INPUT_TAGS
            and isinstance(node[1], dict)
        ):
            for attr in INPUT_VALUE_ATTRS:
                if isinstance(node[1].get(attr), str):
                    node[1][attr] = redactor.typed_value(node[1][attr], found)
        for child in node:
            redact_snapshot_inputs(child, redactor, found)
    elif isinstance(node, dict):
        for child in node.values():
            redact_snapshot_inputs(child, redactor, found)


def redact_trace_event(event, redactor, evaluate_call_ids, found):
    params = event.get('params')
    if isinstance(params, dict):
        if event.get('method') in EVALUATE_METHODS:
            # Tests seed storage through `evaluate`, so its arguments carry
            # whole wallet snapshots, storage encryption key included.
            evaluate_call_ids.add(event.get('callId'))
            if 'arg' in params:
                params['arg'] = REDACTED_VALUE
        if isinstance(params.get('value'), str) and 'selector' in params:
            params['value'] = redactor.typed_value(params['value'], found)
    if event.get('callId') in evaluate_call_ids and 'result' in event:
        event['result'] = REDACTED_VALUE

    def replace_typed(match):
        typed = redactor.typed_value(match.group(2), found)
        return match.group(1) + typed + match.group(3)

    if isinstance(event.get('title'), str):
        event['title'] = TYPING_TITLE_RE.sub(replace_typed, event['title'])
    if event.get('type') == 'log' and isinstance(event.get('message'), str):
        event['message'] = TYPING_LOG_RE.sub(replace_typed, event['message'])
    if event.get('type') == 'frame-snapshot':
        redact_snapshot_inputs(event.get('snapshot'), redactor, found)


def redact_trace(text, redactor, found):
    evaluate_call_ids = set()
    lines = []
    for line in text.split('\n'):
        try:
            event = json.loads(line)
        except ValueError:
            lines.append(line)
            continue
        if isinstance(event, dict):
            redact_trace_event(event, redactor, evaluate_call_ids, found)
            line = json.dumps(event, ensure_ascii=False, separators=(',', ':'))
        lines.append(line)
    return redactor.literals_in('\n'.join(lines), found)


def redact_aria_snapshot(text, redactor, found):
    def replace(match):
        typed = redactor.typed_value(match.group(3), found)
        return match.group(1) + match.group(2) + typed + match.group(2)

    return redactor.literals_in(ARIA_TEXTBOX_RE.sub(replace, text), found)


def redact_text(name, text, redactor):
    found = set()

    def replace_typed_value(match):
        typed = redactor.typed_value(match.group(2), found)
        return match.group(1) + typed + match.group(3)

    text = INLINE_TYPING_RE.sub(replace_typed_value, text)
    text = ELEMENT_PREVIEW_VALUE_RE.sub(replace_typed_value, text)
    if name.endswith('.trace'):
        text = redact_trace(text, redactor, found)
    elif name.endswith('.md') or ARIA_TEXTBOX_RE.search(text):
        text = redact_aria_snapshot(text, redactor, found)
    else:
        text = redactor.literals_in(text, found)
    return text, found


def is_text(name):
    return name.lower().endswith(TEXT_SUFFIXES)


def is_media(name):
    return name.lower().endswith(MEDIA_SUFFIXES)


def decode(data):
    return data.decode('utf-8', errors='surrogateescape')


def encode(text):
    return text.encode('utf-8', errors='surrogateescape')


def remove_screencast_events(data):
    lines = []
    for line in decode(data).splitlines(keepends=True):
        try:
            event = json.loads(line)
        except ValueError:
            lines.append(line)
            continue
        if event.get('type') != 'screencast-frame':
            lines.append(line)
    return encode(''.join(lines))


def redact_trace_zip(path, redactor):
    with zipfile.ZipFile(path) as source:
        entries = [(info, source.read(info)) for info in source.infolist()]

    found = set()
    redacted_entries = []
    for info, data in entries:
        text = None
        if is_text(info.filename):
            text = decode(data)
        elif not is_media(info.filename):
            try:
                text = data.decode('utf-8')
            except UnicodeDecodeError:
                pass
        if text is not None:
            text, found_in_entry = redact_text(info.filename, text, redactor)
            found |= found_in_entry
            data = encode(text)
        redacted_entries.append((info, data))

    drop_media = bool(found & ON_SCREEN_SECRET_ENV_VARS)
    removed_media = 0
    temp_path = path + '.tmp'
    with zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as target:
        for info, data in redacted_entries:
            if drop_media and is_media(info.filename):
                removed_media += 1
                continue
            if drop_media and info.filename.endswith('.trace'):
                data = remove_screencast_events(data)
            target.writestr(info, data, compress_type=zipfile.ZIP_DEFLATED)
    os.replace(temp_path, path)
    return found, removed_media


def redact_text_file(path, redactor):
    with open(path, 'rb') as file:
        text = decode(file.read())
    redacted, found = redact_text(os.path.basename(path), text, redactor)
    if found:
        with open(path, 'wb') as file:
            file.write(encode(redacted))
    return found


def sanitize_title(title):
    # Mirrors the screenshot naming in e2e/fixtures/extension.fixture.ts.
    return re.sub(r'[^a-z0-9]', '_', title, flags=re.IGNORECASE)


def remove_fixture_screenshots(root, tainted_dirs):
    """The extension fixture saves full-page failure screenshots into a shared
    `screenshots/` dir, so they can only be tied to their test via JUnit."""
    screenshots_dir = os.path.join(root, 'screenshots')
    if not tainted_dirs or not os.path.isdir(screenshots_dir):
        return 0
    prefixes = set()
    for name in os.listdir(root):
        if not (name.startswith('junit') and name.endswith('.xml')):
            continue
        for testcase in ET.parse(os.path.join(root, name)).iter('testcase'):
            output = ''.join(testcase.itertext())
            if tainted_dirs & set(ATTACHMENT_DIR_RE.findall(output)):
                title = testcase.get('name', '').split(' › ')[-1]
                prefixes.add(sanitize_title(title) + '-page')
    removed = 0
    for name in os.listdir(screenshots_dir):
        if any(name.startswith(prefix) for prefix in prefixes):
            os.remove(os.path.join(screenshots_dir, name))
            removed += 1
    return removed


def main(root):
    redactor = Redactor(os.environ)
    tainted_dirs = set()
    redacted_files = 0
    removed_media = 0

    for name in os.listdir(root):
        if name.startswith(USER_DATA_PREFIX):
            shutil.rmtree(os.path.join(root, name), ignore_errors=True)

    for dirpath, _, filenames in os.walk(root):
        for filename in filenames:
            path = os.path.join(dirpath, filename)
            if filename.endswith('.zip'):
                found, removed_from_trace = redact_trace_zip(path, redactor)
                removed_media += removed_from_trace
            elif is_text(filename):
                found = redact_text_file(path, redactor)
            else:
                continue
            if found:
                redacted_files += 1
            relative = os.path.relpath(dirpath, root)
            if found & ON_SCREEN_SECRET_ENV_VARS and relative != '.':
                tainted_dirs.add(relative.split(os.sep)[0])

    for test_dir in tainted_dirs:
        for dirpath, _, filenames in os.walk(os.path.join(root, test_dir)):
            for filename in filenames:
                if is_media(filename):
                    os.remove(os.path.join(dirpath, filename))
                    removed_media += 1
    removed_media += remove_fixture_screenshots(root, tainted_dirs)

    print(
        f'Redacted secrets in {redacted_files} file(s); removed {removed_media} '
        f'screenshot/video file(s) from {len(tainted_dirs)} test dir(s) that '
        'typed a recovery phrase or private key.'
    )


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(f'Usage: {sys.argv[0]} <test-results-dir>')
    if not os.path.isdir(sys.argv[1]):
        sys.exit(0)
    main(sys.argv[1])
