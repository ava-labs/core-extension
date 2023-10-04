# Fireblocks

## Transaction Troubleshooting

Below are some of the issues I encountered so far while creating transactions and solutions to those problems.

### **`Bad source id`**

Even though vault accounts have numerical IDs, make sure you're passing them as a string. For example:

#### ❌ Bad

```
{ id: 0, type: PeerType.VAULT_ACCOUNT }
```

#### ✅ Good

```
{ id: '0', type: PeerType.VAULT_ACCOUNT }
```

### **`Signer not found`**

#### **Error message**

> Fireblocks couldn’t find a signer for the transaction. This may happen when:
>
> - The signer doesn’t have permission to sign transactions.
> - The transaction authorization policy (TAP) rule has multiple designated signers, but none has signing privileges.

#### **Solution**

I was using an API User that has an `Editor` role assigned, but our policy did not state a designated signer for transactions like that.

To explain a bit better, transactions initiated by users with an `Editor` role have to be signed by a different user: an `Owner`, an `Admin` or a `Signer`, since those are the only roles that can actually sign shit.

So to make it work, I had to modify our transaction policy so that all transactions initiated by our `API User: Editor` have at least one designated signer assigned.

A different workaround here would be to not use the `API User: Editor`, but rather `API User: Signer`.
Since the transaction initiator is its designated signer by default, this setup just works.
