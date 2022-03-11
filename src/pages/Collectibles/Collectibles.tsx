import { NFT } from '@avalabs/blizzard-sdk';
import {
  GridIcon,
  HorizontalFlex,
  ListIcon,
  PrimaryButton,
  VerticalFlex,
} from '@avalabs/react-components';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { CollectibleGrid } from './components/CollectibleGrid';
import { CollectibleList } from './components/CollectibleList';
import { CollectibleListEmpty } from './components/CollectibleListEmpty';
import { useSetCollectibleParams } from './hooks/useSetCollectibleParams';

enum ListType {
  GRID = 'GRID',
  LIST = 'LIST',
}

const ButtonGroup = styled(HorizontalFlex)`
  border-radius: 4px;
  overflow: hidden;
  width: fit-content;
  margin: 8px 0 8px 16px;
`;

const GroupButton = styled(PrimaryButton)<{ active: boolean }>`
  border-radius: 0;
  width: 32px;
  height: 24px;
  min-height: 24px;
  border: none;

  &:focus {
    border: none;
  }

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.buttons.primary.bgHover : `${theme.palette.grey[100]}4D`};
  }

  ${({ active, theme }) =>
    `background-color: ${
      active ? theme.buttons.primary.bg : `${theme.palette.grey[100]}33`
    }
    };`}
`;

export function Collectibles() {
  const theme = useTheme();
  const { nfts } = useWalletContext();
  const setCollectibleParams = useSetCollectibleParams();
  const [listType, setListType] = useState<ListType>(ListType.GRID);

  return (
    <VerticalFlex grow="1">
      <ButtonGroup>
        <GroupButton
          active={listType === ListType.GRID}
          onClick={() => setListType(ListType.GRID)}
        >
          <GridIcon
            height="14px"
            color={
              listType === ListType.GRID ? theme.colors.bg1 : theme.colors.icon2
            }
          />
        </GroupButton>
        <GroupButton
          active={listType === ListType.LIST}
          onClick={() => setListType(ListType.LIST)}
        >
          <ListIcon
            height="16px"
            color={
              listType === ListType.LIST ? theme.colors.bg1 : theme.colors.icon2
            }
          />
        </GroupButton>
      </ButtonGroup>
      {nfts.length ? (
        <Scrollbars>
          {listType === ListType.LIST ? (
            <CollectibleList
              onClick={(nft: NFT, tokenId: string) =>
                setCollectibleParams({
                  nft,
                  tokenId,
                  options: { path: '/collectible' },
                })
              }
            />
          ) : (
            <CollectibleGrid
              onClick={(nft: NFT, tokenId: string) =>
                setCollectibleParams({
                  nft,
                  tokenId,
                  options: { path: '/collectible' },
                })
              }
            />
          )}
        </Scrollbars>
      ) : (
        <VerticalFlex grow="1" width="100%" align="center" justify="center">
          <CollectibleListEmpty />
        </VerticalFlex>
      )}
    </VerticalFlex>
  );
}
