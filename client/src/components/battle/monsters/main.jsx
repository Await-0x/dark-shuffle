import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography } from "@mui/material";
import { useLottie } from 'lottie-react';
import React, { useContext, useEffect } from "react";
import healAnim from "../../../assets/animations/heal.json";
import swirlAnim from "../../../assets/animations/swirl.json";
import sword from "../../../assets/images/sword.png";
import { AnimationContext } from '../../../contexts/animationHandler';
import { BattleContext } from '../../../contexts/battleContext';
import DamageAnimation from '../../animations/damageAnimation';
import { isMobile } from 'react-device-detect';
import { normalise } from '../../../helpers/utilities';
import { EnemyHealthBar } from '../../../helpers/styles';
import { fetchMonsterImage } from '../../../battle/monsterUtils';


export default function MonsterMain(props) {
    const { monster } = props
    
    return <>
        
    </>
}