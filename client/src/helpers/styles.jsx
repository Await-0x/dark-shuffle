import { Tooltip, styled, tooltipClasses } from "@mui/material";

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

export const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} placement={props.position || "top"} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid rgba(255, 255, 255, 0.6)',
  },
}));