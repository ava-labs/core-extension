import { FC, useMemo } from 'react';
import { Box, Stack, Typography } from '@avalabs/k2-alpine';
import { AgentIdentity } from '@core/types';

type AgentIdentityCardProps = {
  agentIdentity?: AgentIdentity;
};

const truncateAddress = (address: string): string => {
  if (address.length <= 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getTrustLevelText = (trustLevel: AgentIdentity['trustLevel']): string => {
  switch (trustLevel) {
    case 'high':
      return 'High Trust';
    case 'medium':
      return 'Medium Trust';
    case 'low':
      return 'Low Trust';
    case 'unknown':
    default:
      return 'Unknown Trust';
  }
};

export const AgentIdentityCard: FC<AgentIdentityCardProps> = ({
  agentIdentity,
}) => {
  const scoreColor = useMemo(() => {
    if (!agentIdentity) return '';
    const score = agentIdentity.reputationScore;
    if (score === null) {
      return 'text.disabled';
    }
    if (score >= 75) {
      return 'success.main';
    }
    if (score >= 40) {
      return 'warning.main';
    }
    return 'error.main';
  }, [agentIdentity]);

  if (!agentIdentity) {
    return null;
  }

  const registryAddress =
    agentIdentity.agentRegistry.split(':')[2] ?? agentIdentity.agentRegistry;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
            }}
            color="text.secondary"
          >
            AI Agent
          </Typography>
          <Box
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 1,
              bgcolor: scoreColor,
              opacity: agentIdentity.reputationScore === null ? 0.5 : 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: 'common.white',
              }}
            >
              {agentIdentity.reputationScore !== null
                ? `${agentIdentity.reputationScore}/100`
                : 'N/A'}
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={0.5}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body2" color="text.secondary">
              Agent ID
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              #{agentIdentity.agentId}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body2" color="text.secondary">
              Registry
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontFamily: 'monospace',
              }}
            >
              {truncateAddress(registryAddress)}
            </Typography>
          </Stack>

          {agentIdentity.owner && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="body2" color="text.secondary">
                Owner
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontFamily: 'monospace',
                }}
              >
                {truncateAddress(agentIdentity.owner)}
              </Typography>
            </Stack>
          )}

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body2" color="text.secondary">
              Trust Level
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: scoreColor,
              }}
            >
              {getTrustLevelText(agentIdentity.trustLevel)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
