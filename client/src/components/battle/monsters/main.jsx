import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography } from "@mui/material";
import React, { useContext } from "react";
import { isMobile } from 'react-device-detect';
import sword from "../../../assets/images/sword.png";
import { AnimationContext } from '../../../contexts/animationHandler';
import { EnemyHealthBar } from '../../../helpers/styles';
import { normalise } from '../../../helpers/utilities';
import DamageAnimation from '../../animations/damageAnimation';
import { fetch_beast_image } from '../../../helpers/cards';

export default function MonsterMain(props) {
    const { monster } = props

    const animationHandler = useContext(AnimationContext)

    const damage = animationHandler.damageAnimations.find(x => x.targetId === monster.id)

    return <>
        <EnemyHealthBar variant="determinate" value={normalise(monster.health, monster.startHealth)} />

        {damage && <DamageAnimation id={damage.id} damage={damage.damage} />}

        <Box sx={styles.imageContainer}>
            {<img alt='' src={fetch_beast_image(monster.name)} height={'100%'} />}
        </Box>

        <Box sx={styles.bottomContainer}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" fontSize={isMobile && '14px'}>
                    {monster.attack}
                </Typography>

                <img alt='' src={sword} height={isMobile ? 20 : 24} width={isMobile ? 20 : 24} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" fontSize={isMobile && '14px'}>
                    {monster.health}
                </Typography>

                <FavoriteIcon htmlColor="red" fontSize={isMobile ? 'small' : 'inherit'} />
            </Box>
        </Box>
    </>
}

const styles = {
    imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '70%'
    },
    bottomContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
}