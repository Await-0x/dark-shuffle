import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import { Box, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import bolt from "../../assets/images/bolt.png";
import sword from "../../assets/images/sword.png";
import { MONSTER_LIST } from '../../battle/monsterUtils';
import { GameContext } from '../../contexts/gameContext';
import { CARD_LIST, fetch_image } from '../../helpers/cards';
import { levelColors } from '../../helpers/constants';
import { CustomTooltip } from '../../helpers/styles';

const node_example = [
  {
    id: 1,
    parents: [],
    last_node: false,
    status: 0,
    type: 'monster',
    monster_id: 403,
    health: 50,
    attack: 10,
  },
  {
    id: 2,
    parents: [1],
    last_node: false,
    status: 0,
    type: 'monster',
    monster_id: 407,
    health: 30,
    attack: 3
  },
  {
    id: 3,
    parents: [1],
    last_node: false,
    status: 0,
    type: 'card',
    card_id: 14,
    level: 11
  },
  {
    id: 4,
    parents: [100],
    last_node: false,
    status: 0,
    type: 'monster',
    monster_id: 401,
    health: 21,
    attack: 1
  },
  {
    id: 5,
    parents: [2],
    last_node: false,
    status: 0,
    type: 'monster',
    monster_id: 403,
    health: 50,
    attack: 10
  },
  {
    id: 6,
    parents: [2],
    last_node: false,
    status: 0,
    type: 'card',
    card_id: 22,
    level: 5
  },
  {
    id: 7,
    parents: [3],
    last_node: false,
    status: 0,
    type: 'monster',
    monster_id: 401,
    health: 45,
    attack: 5
  },
  {
    id: 8,
    parents: [3],
    last_node: false,
    status: 0,
    type: 'monster',
    monster_id: 404,
    health: 40,
    attack: 5
  },
  {
    id: 9,
    parents: [4],
    last_node: false,
    status: 0,
    type: 'monster',
    monster_id: 403,
    health: 70,
    attack: 3
  },
  {
    id: 10,
    parents: [4],
    last_node: false,
    status: 0,
    type: 'card',
    card_id: 1,
    level: 2
  },
  {
    id: 11,
    parents: [5, 6],
    last_node: false,
    status: 0,
    type: 'monster',
    monster_id: 403,
    health: 50,
    attack: 10
  },
  {
    id: 12,
    parents: [622],
    last_node: false,
    status: 0,
    type: 'card',
    card_id: 22,
    level: 5
  },
  {
    id: 13,
    parents: [7],
    last_node: false,
    status: 0,
    type: 'monster',
    monster_id: 406,
    health: 40,
    attack: 5
  },
  {
    id: 14,
    parents: [8],
    last_node: false,
    status: 0,
    type: 'energy',
    amount: 3,
  },
  {
    id: 15,
    parents: [9, 10],
    last_node: false,
    status: 0,
    type: 'energy',
    amount: 3,
  },
  {
    id: 16,
    parents: [11, 12, 13, 14, 15],
    last_node: true,
    status: 0,
    type: 'monster',
    monster_id: 403,
    health: 50,
    attack: 10
  },
]

function RenderSquare(node, connector) {
  return <Box sx={styles.circleContainer}>
    {connector === 'split' && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '1px', height: '16px' }} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ height: '1px', background: '#FFE97F80', width: '29px' }} />
        {renderCard(node)}
        <Box sx={{ height: '1px', background: '#FFE97F80', width: '29px' }} />
      </Box>
      <Box sx={{ width: '1px', background: '#FFE97F80', height: '17px' }} />
    </Box>}

    {connector === 'reversedSplit' && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '1px', background: '#FFE97F80', height: '16px', mr: '1px' }} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ height: '1px', background: '#FFE97F80', width: '29px' }} />
        {renderCard(node)}
        <Box sx={{ height: '1px', background: '#FFE97F80', width: '29px' }} />
      </Box>
      <Box sx={{ width: '1px', height: '17px' }} />
    </Box>}

    {connector === 'connected' && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '1px', background: '#FFE97F80', height: '17px' }} />
      {renderCard(node)}
      <Box sx={{ width: '1px', background: '#FFE97F80', height: '16px', ml: '1px' }} />
    </Box>}
  </Box>
}

function RenderMonsterCircle(node) {
  let monster = MONSTER_LIST.find(monster => monster.id === node.monster_id)

  return <Box sx={styles.circleContainer}>
    <CustomTooltip position={'right'} title={monster.abilities}>
      <Box sx={styles.monsterCircle}>
        <Box sx={{ width: '100%', height: '75%', display: 'flex', justifyContent: 'center' }}>
          {monster.image}
        </Box>

        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>
              {node.attack}
            </Typography>

            <img alt='' src={sword} height={18} width={18} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>
              {node.health}
            </Typography>

            <FavoriteIcon htmlColor="red" fontSize='small' />
          </Box>
        </Box>

        {node.collectible && <Box sx={{ position: 'absolute', top: 3, left: 3 }}>
          <StarIcon htmlColor="gold" fontSize='small' />
        </Box>}
      </Box>
    </CustomTooltip>
  </Box>
}

function renderCard(node) {
  let levelColor = levelColors[Math.floor(node.level / 3)]

  return <Box sx={styles.square}>
    <img alt='' src={fetch_image(CARD_LIST.find(card => card.cardId === node.card_id).name)} width={'75%'} />
    <Box sx={{ width: '40%', height: '2px' }} bgcolor={levelColor.bg} />
  </Box>
}

function renderPotionNode(node) {
  return <Box sx={styles.smallCircle}>
    <FavoriteIcon htmlColor="red" sx={{ fontSize: '25px' }} />
    <Typography>
      {node.amount}
    </Typography>
  </Box>
}

function renderEnergyNode(node) {
  return <Box sx={styles.smallCircle}>
    <img alt='' src={bolt} height={24} />
    <Typography variant='h6' mt={'-2px'}>
      {node.amount}
    </Typography>
  </Box>
}

function RenderSmallCircle(node, connector) {
  return <Box sx={styles.circleContainer}>
    {connector === 'split' && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '1px', height: '25px' }} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ height: '1px', background: '#FFE97F80', width: '25px' }} />
        {node.type === 'potion' ? renderPotionNode(node) : renderEnergyNode(node)}
        <Box sx={{ height: '1px', background: '#FFE97F80', width: '25px' }} />
      </Box>
      <Box sx={{ width: '1px', background: '#FFE97F80', height: '25px' }} />
    </Box>}

    {connector === 'reversedSplit' && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '1px', background: '#FFE97F80', height: '24px', mr: '1px' }} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ height: '1px', background: '#FFE97F80', width: '24px' }} />
        {node.type === 'potion' ? renderPotionNode(node) : renderEnergyNode(node)}
        <Box sx={{ height: '1px', background: '#FFE97F80', width: '24px' }} />
      </Box>
      <Box sx={{ width: '1px', height: '25px' }} />
    </Box>}

    {connector === 'connected' && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '1px', background: '#FFE97F80', height: '24px' }} />
      {node.type === 'potion' ? renderPotionNode(node) : renderEnergyNode(node)}
      <Box sx={{ width: '1px', background: '#FFE97F80', height: '24px' }} />
    </Box>}
  </Box >
}

function RenderConnectedNode(node) {
  return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Box sx={{ width: '1px', height: '50px', background: '#FFE97F80' }} />
    {RenderType(node, 'connected')}
  </Box>
}

function RenderSplitNode(node) {
  return <>
    <Box display={'flex'} alignItems={'flex-end'}>
      <Box sx={styles.curvedLine} borderLeft={'1px solid #FFE97F80'} width={'40px'} />
      {RenderType(node, 'split')}
      <Box sx={styles.curvedLine} borderRight={'1px solid #FFE97F80'} width={'40px'} />
    </Box>
  </>
}

function renderReversedSplitNode(node) {
  return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Box sx={{ width: '1px', height: '50px', background: '#FFE97F80' }} />

    <Box display={'flex'} alignItems={'flex-end'}>
      <Box sx={styles.curvedLineReverse} borderLeft={'1px solid #FFE97F80'} width={'40px'} />
      {RenderType(node, 'reversedSplit')}
      <Box sx={styles.curvedLineReverse} borderRight={'1px solid #FFE97F80'} width={'39px'} />
    </Box>
  </Box>
}

function RenderType(node, connector) {
  if (node.type === 'monster') return RenderMonsterCircle(node);
  if (['potion', 'energy'].includes(node.type)) return RenderSmallCircle(node, connector);
  if (node.type === 'card') return RenderSquare(node, connector);
}

function RenderNode(node, row, prevRow, nextRow) {
  if (prevRow && row.length < prevRow.length) {
    return RenderSplitNode(node)
  } else if (nextRow && row.length < nextRow.length) {
    return renderReversedSplitNode(node)
  } else {
    return RenderConnectedNode(node)
  }
}

function Structure() {
  const game = useContext(GameContext)

  const [nodes, setNodes] = useState(node_example)
  const [tree, buildTree] = useState([])

  useEffect(() => {
    let endNode = nodes[nodes.length - 1]
    let sectionStartNodes = nodes.filter(node => node.parents.includes(nodes[0].id))

    buildTree(sectionStartNodes.map(startNode => {
      let currentNodes = [startNode]
      let generatedSection = []

      while (currentNodes[0].id !== endNode.id) {
        generatedSection.push(currentNodes)
        currentNodes = nodes.filter(node => currentNodes.find(currentNode => node.parents.includes(currentNode.id)))
      }

      return generatedSection.reverse()
    }))
  }, [nodes])

  if (tree.length === 0) {
    return <Box />
  }

  let paddingLeft = (tree[0][0].length > 1 ? 100 : 200) + (tree.length > 1 ? 0 : 400) + (tree.length === 2 ? 200 : 0)
  let paddingRight = (tree[tree.length - 1][0].length > 1 ? 100 : 200) + (tree.length > 1 ? 0 : 400) + (tree.length === 2 ? 200 : 0)

  return (
    <Box sx={styles.container}>
      <Box sx={styles.topNode}>
        {RenderConnectedNode(nodes[nodes.length - 1])}

        <Box sx={{ height: '25px', width: '1px', background: '#FFE97F80' }} />

        <Box sx={{ width: `calc(100% - ${Math.min(1199, paddingLeft + paddingRight)}px)`, height: '1px', background: '#FFE97F80', mr: `${paddingRight}px`, ml: `${paddingLeft}px` }} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>

        <Box sx={styles.section}>
          {tree.length > 1 && React.Children.toArray(
            tree[0].map((row, i) => <>
              <Box sx={styles.row}>
                {React.Children.toArray(
                  row.map(node => RenderNode(node, row, tree[0][i - 1], tree[0][i + 1]))
                )}
              </Box>
            </>)
          )}

          {tree.length === 2 && <Box sx={[styles.curvedLine, { mb: 0, height: '50px' }]} borderLeft={'1px solid #FFE97F80'} ml={'50%'} width={'50%'} />}
          {tree.length === 3 && <Box sx={styles.curvedLine} borderLeft={'1px solid #FFE97F80'} ml={'50%'} width={'50%'} />}
        </Box>

        {(tree.length === 1 || tree.length === 3) && <Box sx={styles.section}>
          {React.Children.toArray(
            (tree.length === 1 ? tree[0] : tree[1]).map((row, i) => <>
              <Box sx={styles.row}>
                {React.Children.toArray(
                  row.map(node => RenderNode(node, row, (tree.length === 1 ? tree[0] : tree[1])[i - 1], (tree.length === 1 ? tree[0] : tree[1])[i + 1]))
                )}
              </Box>
            </>)
          )}

          {tree.length === 3 && <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <Box sx={styles.curvedLine} width={'calc(50% - 60px)'}></Box>
            {RenderConnectedNode(nodes[0])}
            <Box sx={styles.curvedLine} width={'calc(50% - 60px)'}></Box>
          </Box>}

        </Box>}

        <Box sx={styles.section}>
          {tree.length > 1 && React.Children.toArray(
            (tree.length > 2 ? tree[2] : tree[1]).map((row, i) => <>
              <Box sx={styles.row}>
                {React.Children.toArray(
                  row.map(node => RenderNode(node, row, (tree.length > 2 ? tree[2] : tree[1])[i - 1], (tree.length > 2 ? tree[2] : tree[1])[i + 1]))
                )}
              </Box>
            </>)
          )}

          {tree.length === 2 && <Box sx={[styles.curvedLine, { mb: 0, height: '50px' }]} borderRight={'1px solid #FFE97F80'} mr={'50%'} width={'50%'} />}
          {tree.length === 3 && <Box sx={styles.curvedLine} borderRight={'1px solid #FFE97F80'} mr={'50%'} width={'50%'} />}
        </Box>

      </Box>

      <Box sx={styles.topNode}>
        {tree.length < 3 && <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          {RenderConnectedNode(nodes[0])}
        </Box>}

        <Box sx={{ width: '1px', height: '25px', background: '#FFE97F80' }} />
      </Box>
    </Box >
  )
}

export default Structure

const styles = {
  container: {
    width: '1200px',
    height: '100%',
    margin: 'auto',
    overflow: 'scroll',
  },
  section: {
    height: '100%',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    boxSizing: 'border-box'
  },
  row: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: '80px'
  },
  lineRow: {
    width: '100%',
    height: '30px'
  },
  circleContainer: {
    width: '120px',
    height: '120px',
    borderRadius: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  square: {
    width: '60px',
    height: '85px',
    background: '#141920',
    border: '1px solid #ffffff3d',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  monsterCircle: {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    background: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid #FFE97F80',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    p: 1,
    cursor: 'pointer'
  },
  smallCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '100%',
    background: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid #FFE97F80',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  curvedLine: {
    height: '111px',
    borderBottom: '1px solid #FFE97F80',
    mb: '60px'
  },
  curvedLineReverse: {
    height: '60px',
    borderTop: '1px solid #FFE97F80',
  },
  topNode: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}