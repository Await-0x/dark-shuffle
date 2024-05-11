import { Box, Dialog, Step, StepButton, StepLabel, Stepper, Typography } from '@mui/material';
import { useAccount, useConnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import AddFunds from './addFunds';
import ConnectWallet from './connectWallet';
import CreateBurner from './createBurner';

const steps = [
  'Connect Wallet',
  'Create Account',
  'Add Funds',
];

function OnboardingWizard(props) {
  const { open, close, step } = props
  const { address } = useAccount()

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setActiveStep(step)
  }, [step])

  useEffect(() => {
    if (address) {
      close(false);
      // setActiveStep(1);
    }
  }, [address])

  function SquareStep(props) {
    const { active, icon } = props;

    return (
      <Box
        sx={styles.squareStep}
        bgcolor={active ? '#FFE97F' : 'rgb(49, 53, 60)'}
      >
        <Typography lineHeight={'20px'} variant="h6" color={active ? 'rgb(0, 0, 0)' : 'rgb(234, 236, 239)'}>
          {icon}
        </Typography>
      </Box>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={() => close(false)}
      maxWidth={'lg'}
      PaperProps={{
        sx: { background: 'rgba(0, 0, 0, 0.98)', border: '2px solid #FFE97F' }
      }}
    >

      <Box sx={styles.wizardContainer}>
        {/* <Stepper
          activeStep={activeStep}
          nonLinear
          sx={{ background: 'inherit', padding: '0', margin: '0 20px' }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton onClick={() => handleStep(index)}>
                <StepLabel StepIconComponent={SquareStep}>
                  <Typography variant="h6" color='primary'>{label}</Typography>
                </StepLabel>
              </StepButton>
            </Step>
          ))}
        </Stepper> */}

        {activeStep === 0 && <ConnectWallet />}
        {activeStep === 1 && <CreateBurner fade={step} setActiveStep={setActiveStep} />}
        {activeStep === 2 && <AddFunds fade={step} />}
      </Box>

    </Dialog>
  )
}

export default OnboardingWizard

const styles = {
  wizardContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '36px 30px',
    width: '700px',
    height: '400px',
  },
  squareStep: {
    width: '30px',
    height: '30px',
    borderRadius: '5px',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}