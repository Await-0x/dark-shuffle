import { Tooltip, tooltipClasses } from "@mui/material";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import * as React from 'react';

export const _styles = {
  customBox: {
    background: 'rgba(0, 0, 0, 0.4)',
    color: 'white',
    boxSizing: 'border-box'
  },
  linearBg: {
    background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1))',
  }
}

export const LargeCustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} placement={props.position || "top"} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 320,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid rgba(255, 255, 255, 0.6)',
    background: '#141920',
  },
}));

export const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} placement={props.position || "top"} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid rgba(255, 255, 255, 0.6)',
    background: '#141920',
  },
}));

export const HealthBar = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 6,
  width: '100%',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: 'red',
  },
}));

export const EnergyBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#FFE97F',
  },
}));

export const EnemyHealthBar = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 2,
  width: '100%',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: 'red',
  },
}));

export const ShieldBar = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 6,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'transparent',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#8B0000',
  },
}));