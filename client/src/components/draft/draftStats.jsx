import { Box, Typography } from "@mui/material";
import { BarChart } from '@mui/x-charts';
import React, { useContext } from "react";
import { DraftContext } from "../../contexts/draftContext";
import { tags, types } from "../../helpers/cards";
import { DRAFT_SIZE } from "../../helpers/constants";

function DraftStats() {
  const draft = useContext(DraftContext)

  const creatures = draft.cards.filter(card => card.type === types.CREATURE).length
  const spells = draft.cards.filter(card => card.type === types.SPELL).length

  return <Box sx={styles.container}>

    <Box>
      <Typography variant="h6">
        Draft
      </Typography>
      <Typography variant="h2" color='primary' mb={1}>
        {draft.cards.length + draft.bench.length}/{DRAFT_SIZE}
      </Typography>
    </Box>

    <Box pb={5}>
      <BarChart
        width={400}
        height={225}
        slotProps={{
          legend: {
            hidden: true
          }
        }}
        leftAxis={null}
        yAxis={[{ disableLine: true, disableTicks: true }]}
        xAxis={[
          {
            data: ['0', '1', '2', '3', '4', '5', '6', '7', '8+'],
            scaleType: 'band',
            hideTooltip: true
          },
        ]}
        series={Object.entries(draft.manaCurve).map(([key, value]) => {
          return {
            label: key,
            data: value,
            stack: 'A'
          }
        })}
        colors={['#FFE97F']}
      />
    </Box>

    <Box sx={styles.tagContainer}>

      {React.Children.toArray(
        Object.values(tags).map((tag, i) => {
          const count = draft.tagCount[i]

          if (count > 0) {
            return <Box sx={styles.chip}>
              <Typography>
                {`${count} ${tag}`}
              </Typography>
            </Box>
          }
        })
      )}

    </Box>

  </Box>
}

export default DraftStats

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    p: 1,
    boxSizing: 'border-box'
  },
  tagContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    height: '150px',
    flexWrap: 'wrap'
  },
  chip: {
    border: '1px solid #FFE97F',
    borderRadius: '12px',
    padding: '4px 12px',
    display: 'flex'
  },
}