import { Box, Typography } from "@mui/material";
import { BarChart } from '@mui/x-charts';
import React, { useContext } from "react";
import { DraftContext } from "../../contexts/draftContext";
import { DRAFT_SIZE } from "../../helpers/constants";
import { useState } from "react";
import { useEffect } from "react";
import { types } from "../../helpers/cards";

function DraftStats() {
  const draft = useContext(DraftContext)
  const { cards } = draft.getState

  const [manaCurve, setManaCurve] = useState({});

  useEffect(() => {
    let copy = {
      [types.CREATURE]: [0, 0, 0, 0, 0, 0],
      [types.SPELL]: [0, 0, 0, 0, 0, 0]
    }

    cards.forEach(card => {
      copy[card.cardType][card.cost] += 1;
    })

    setManaCurve(copy)
  }, [cards]);

  const typeCount = cards.reduce((acc, card) => {
    acc[card.creatureType] = (acc[card.creatureType] || 0) + 1
    return acc
  }, {})

  return <Box sx={styles.container}>

    <Box>
      <Typography variant="h6">
        Draft
      </Typography>
      <Typography variant="h2" color='primary' mb={1}>
        {cards.length}/{DRAFT_SIZE}
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
            data: ['0', '1', '2', '3', '4', '5'],
            scaleType: 'band',
            hideTooltip: true
          },
        ]}
        series={Object.entries(manaCurve).map(([key, value]) => {
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
        Object.keys(typeCount).map((type, i) => {
          const count = typeCount[type]

          if (count > 0) {
            return <Box sx={styles.chip}>
              <Typography>
                {`${count} ${type}`}
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