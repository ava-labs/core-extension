import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { useStore } from '@src/store/store';

import { Progress } from '@src/components/misc/progress';
import { FullWidthButton } from '@src/styles/styles';

export interface AllDoneProps {
  currentPosition: number;
  goBack: () => void;
}

export const AllDone = (props: AllDoneProps): React.ReactElement => {
  const history = useHistory();
  const { currentPosition, goBack } = props;

  const { onboardStore, walletStore } = useStore();

  return (
    <>
      <Nav>
        <Progress
          goBack={goBack}
          currentPosition={currentPosition}
          totalDots={4}
        />
      </Nav>
      <Container>
        <h1>You're all done!</h1>
        <h5>
          Follow along with product updates or reach out if you have any
          questions
        </h5>
        <Social className="twitter">
          <div className="logo">
            <img
              src="https://assets.website-files.com/6059b554e81c705f9dd2dd32/60758ed915165d54b3288368_Twitter.svg"
              loading="lazy"
              alt=""
            ></img>
          </div>
          <div className="list">
            <ul role="list">
              <li>
                <a href="https://twitter.com/avalancheavax" target="_blank">
                  English
                </a>
              </li>
              <li>
                <a href="https://twitter.com/avalanche_fr" target="_blank">
                  French
                </a>
              </li>
              <li>
                <a href="https://twitter.com/avalanche_dach" target="_blank">
                  German
                </a>
              </li>
              <li>
                <a href="https://twitter.com/avalanche_it" target="_blank">
                  Italian
                </a>
              </li>
              <li>
                <a href="https://twitter.com/avalanchejp" target="_blank">
                  Japanese
                </a>
              </li>
              <li>
                <a href="https://twitter.com/avalanche_ru" target="_blank">
                  Russian
                </a>
              </li>
              <li>
                <a href="https://twitter.com/avalanche_esp" target="_blank">
                  Spanish
                </a>
              </li>
              <li>
                <a href="https://twitter.com/avalanche_tr" target="_blank">
                  Turkish
                </a>
              </li>
            </ul>
          </div>
        </Social>
        <Social className="telegram">
          <div className="logo">
            <img
              src="https://assets.website-files.com/6059b554e81c705f9dd2dd32/60758ed9b436d51383a38628_Vector.svg"
              loading="lazy"
              alt=""
            ></img>
          </div>
          <div className="list">
            <ul role="list">
              <li>
                <a href="https://t.me/avalancheavax" target="_blank">
                  English
                </a>
              </li>
              <li>
                <a href="https://t.me/avalanche_zh" target="_blank">
                  Chinese
                </a>
              </li>
              <li>
                <a href="https://t.me/avalanche_nl" target="_blank">
                  Dutch
                </a>
              </li>
              <li>
                <a href="https://t.me/avalanche_fr" target="_blank">
                  French
                </a>
              </li>
              <li>
                <a href="https://t.me/avalanche_dach" target="_blank">
                  German
                </a>
              </li>
              <li>
                <a href="#" target="_blank">
                  Hindi
                </a>
              </li>
              <li>
                <a href="https://t.me/avalanche_id" target="_blank">
                  Indonesian
                </a>
              </li>
              <li>
                <a href="https://t.me/avalanche_it" target="_blank">
                  Italian
                </a>
              </li>
              <li>
                <a href="https://t.me/avalanche_jp" target="_blank">
                  Japanese
                </a>
              </li>
              <li>
                <a href="https://t.me/avalanche_ng" target="_blank">
                  Korean
                </a>
              </li>
              <li>
                <a href="https://t.me/avalanche_ng" target="_blank">
                  Nigeria
                </a>
              </li>
              <li>
                <a href="https://t.me/Avalanche_fa" target="_blank">
                  Persian
                </a>
              </li>
              <li>
                <a href="https://t.me/avalanche_pt" target="_blank">
                  Portugese
                </a>
              </li>
              <li>
                <a href="https://t.me/avalanche_ru" target="_blank">
                  Russian
                </a>
              </li>
              <li>
                <a href="https://t.me/avalanche_es" target="_blank">
                  Spanish
                </a>
              </li>
              <li>
                <a href="https://t.me/avalanche_tr" target="_blank">
                  Turkish
                </a>
              </li>
              <li>
                <a href="https://t.me/avalanche_vn" target="_blank">
                  Vietnamese
                </a>
              </li>
            </ul>
          </div>
        </Social>

        <Social className="discord">
          <div className="logo">
            <img
              src="https://assets.website-files.com/6059b554e81c705f9dd2dd32/60758ed858d0be52a40d7d14_Logo.svg"
              loading="lazy"
              alt=""
            ></img>
          </div>
          <div className="list">
            <ul role="list">
              <li>
                <a href="https://discord.com/invite/RwXY7P6" target="_blank">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </Social>

        <Social className="reddit">
          <div className="logo">
            <img
              src="https://assets.website-files.com/6059b554e81c705f9dd2dd32/60758ed86037f33fb8ed00f0_reddit.svg"
              loading="lazy"
              alt=""
            ></img>
          </div>
          <div className="list">
            <ul role="list">
              <li>
                <a href="https://www.reddit.com/r/Avax/" target="_blank">
                  Reddit
                </a>
              </li>
            </ul>
          </div>
        </Social>

        <br />
        <br />
        <FullWidthButton
          onClick={() => {
            onboardStore.markOnboarded();
            walletStore.updateWallet();
            history.push('/wallet');
          }}
        >
          Finish
        </FullWidthButton>
      </Container>
    </>
  );
};

AllDone.defaultProps = {};

export const Social = styled.div`
  display: flex;
  padding-top: 1rem;
  padding-bottom: 1rem;
  flex-direction: row;
  justify-content: unset;
  align-items: center;
  .logo {
    margin: auto 2rem;
  }
  &.twitter {
    background-color: #1da1f2;
  }
  &.telegram {
    background-color: #38afe2;
  }
  &.discord {
    background-color: #7289da;
  }
  &.reddit {
    background-color: #ff4500;
  }
  img {
    max-width: 2rem;
  }
  h3 {
    padding-top: 5px;
    color: #fff;
    text-decoration: none;
    font-family: Calibre, sans-serif;
    font-size: 20px;
    line-height: 110%;
    font-weight: 700;
  }
  .list {
    display: flex;
    ul {
      list-style: none;
      display: inline-flex;
      flex-wrap: wrap;
    }
    li {
      display: flex;
      width: 80px;
      justify-content: space-between;
      flex-wrap: nowrap;
      margin: 0.2rem;
      a {
        position: static;
        font-family: Calibre, sans-serif;
        color: #fff;
        text-align: left;
        font-size: 0.7rem;
        text-decoration: underline;
      }
    }
  }
`;

export const Container = styled.div`
  margin: 0 auto;
  padding: 1.5rem;
  text-align: center;
  .words {
    display: grid;
    grid-template-columns: auto auto auto auto;
    border: 1px solid grey;
    padding: 1rem;
    width: 90%;
    margin: 3rem auto;
    background: grey;
    span {
      line-height: 1.2rem;
    }
  }
`;

export const Nav = styled.div`
  width: 100%;
  padding: 0.4rem 0;
  border-bottom: 1px solid grey;
`;
