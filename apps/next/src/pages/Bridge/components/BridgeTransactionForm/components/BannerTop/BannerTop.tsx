import { PageControl } from '@/components/PageControl';
import { Fade, IconButton, Stack, styled } from '@avalabs/k2-alpine';
import { FeatureGates } from '@core/types';
import { useDismissedBanners, useFeatureFlagContext } from '@core/ui';
import { FC, MouseEventHandler, useEffect, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HallidayCard } from './components/HallidayCard';

type AvailableCard = {
  id: string;
  Component: FC;
};

const HALLIDAY_BANNER_ID = 'halliday-e2d6f109-2137-4303-9321-17b010781372';
const AVAILABLE_CARDS: AvailableCard[] = [
  { id: HALLIDAY_BANNER_ID, Component: HallidayCard },
];

const getNotDismissedCards = async (
  cards: AvailableCard[],
  predicate: (id: string) => Promise<boolean>,
) => {
  const visibleCards: AvailableCard[] = [];
  for (const card of cards) {
    const isDismissed = await predicate(card.id);
    if (!isDismissed) {
      visibleCards.push(card);
    }
  }
  return visibleCards;
};

const BannerTop: FC = () => {
  const [currentCardIndex] = useState(0);
  const [cards, setCards] = useState<AvailableCard[] | undefined>(undefined);
  const [isHovered, setIsHovered] = useState(false);
  const onHoverChange: MouseEventHandler<HTMLDivElement> = (event) => {
    setIsHovered(event.type === 'mouseenter');
  };

  const { isDismissed, dismiss } = useDismissedBanners();

  useEffect(() => {
    getNotDismissedCards(AVAILABLE_CARDS, isDismissed).then(setCards);
  }, [isDismissed]);

  if (!cards || cards.length === 0) {
    return null;
  }

  const card = cards[currentCardIndex];

  return (
    <Stack
      mt={-0.5}
      position="relative"
      onMouseEnter={onHoverChange}
      onMouseLeave={onHoverChange}
    >
      <Fade in={isHovered} timeout={300} easing="ease-in-out">
        <ClearCardButton
          size="small"
          color="primary"
          onClick={
            card &&
            (() => {
              dismiss(card.id);
              setCards(
                (prev) => prev && prev.filter(({ id }) => id !== card.id),
              );
            })
          }
        >
          <AiFillCloseCircle size={20} />
        </ClearCardButton>
      </Fade>
      {card && <card.Component />}
      <PageControl
        current={1}
        total={cards.length}
        marginInline="auto"
        my={1}
      />
    </Stack>
  );
};

const BannerTopGate: FC = () => {
  const { isFlagEnabled } = useFeatureFlagContext();
  return isFlagEnabled(FeatureGates.HALLIDAY_BRIDGE_BANNER) ? (
    <BannerTop />
  ) : null;
};

export { BannerTopGate as BannerTop };

const ClearCardButton = styled(IconButton)({
  position: 'absolute',
  top: 0,
  right: 0,
  transform: 'translate(50%, -50%)',
});
