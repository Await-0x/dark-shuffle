import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { _styles } from '../helpers/styles';
import { dojoConfig } from '../../dojo.config';
import { useEffect } from 'react';
import { getDonations } from '../api/indexer';
import { useState } from 'react';
import AddDonation from '../components/dialogs/addDonation';
import { hexToAscii } from '@dojoengine/utils';

function DonationPage() {
  const [donations, setDonations] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function fetchDonations() {
    setLoading(true);
    const donations = await getDonations(dojoConfig.seasonId, page);
    setDonations(donations);
    setLoading(false);
  }

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <Box sx={[_styles.customBox, _styles.linearBg, styles.container]}>
      <Box sx={styles.header} mb={2}>
        <Typography variant={'h4'} color={'primary'}>
          Donate to the Season Pool
        </Typography>

        <Button variant='outlined' sx={{ fontSize: '14px', letterSpacing: '0.5px', textTransform: 'none' }} onClick={() => setOpen(true)}>
          + Add Donation
        </Button>
      </Box>

      <Scrollbars style={{ width: '100%', paddingBottom: '20px', height: '1000px', border: '1px solid #FFE97F50', borderRadius: '5px' }}>
        <Box sx={styles.tableHeader}>
          <Box width='30px' textAlign={'center'}>
            <Typography color={'primary'}>Rank</Typography>
          </Box>

          <Box width='250px'>
            <Typography color={'primary'}>Donor</Typography>
          </Box>

          <Box width='250px'>
            <Typography color={'primary'}>Social</Typography>
          </Box>

          <Box width='100px' textAlign={'center'}>
            <Typography color={'primary'}>$Lords</Typography>
          </Box>
        </Box>

        {loading && <Box />}

        {!loading && React.Children.toArray(
          donations.map((donation, i) => {
            return <>
              <Box sx={styles.row}>
                <Box width='30px' textAlign={'center'}>
                  <Typography>{page * 100 + i + 1}</Typography>
                </Box>

                <Box width='250px'>
                  <Typography>{hexToAscii(donation.name) || 'Anonymous'}</Typography>
                </Box>

                <Box width='250px'>
                  {donation.social !== '0x30' && <Typography>
                    <a style={{ color: '#fff' }} href={`https://x.com/${hexToAscii(donation.social)}`} target="_blank">https://x.com/{hexToAscii(donation.social)}</a>
                  </Typography>}
                </Box>

                <Box width='100px' textAlign={'center'}>
                  <Typography>{(donation.amount / 1e18).toLocaleString()}</Typography>
                </Box>
              </Box>
            </>
          })
        )}
      </Scrollbars>

      <AddDonation open={open} close={() => setOpen(false)} refresh={() => fetchDonations()} />
    </Box>
  )
}

export default DonationPage

const styles = {
  container: {
    width: '950px',
    maxWidth: '98vw',
    margin: 'auto',
    height: '100%',
    mt: 2,
    px: 3,
    pt: 2,
    pb: 10,
    boxSizing: 'border-box',
    borderRadius: '5px'
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    p: 2,
    opacity: 0.9,
    borderBottom: '1px solid #FFE97F50'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    px: 2,
    py: 2,
    opacity: 0.9,
    borderBottom: '1px solid #FFE97F50'
  }
}