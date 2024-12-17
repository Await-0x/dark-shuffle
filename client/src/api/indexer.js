import { getEntityIdFromKeys } from "@dojoengine/utils";
import { gql, request } from 'graphql-request';
import { dojoConfig } from '../../dojo.config';

export async function getSeason(season_id) {
  const document = gql`
  {
    darkshuffleSeasonModels(where:{season_id:${season_id}}) {
      edges {
        node {
          season_id,
          settings_id,
          start,
          end,
          entry_amount,
          reward_pool,
          finalized
        }
      }
    }
  }`

  const res = await request(dojoConfig.toriiUrl, document)

  return res?.darkshuffleSeasonModels?.edges[0]?.node
}

export async function getSettings(settings_id) {
  const document = gql`
  {
    darkshuffleGameSettingsModels(where:{settings_id:${settings_id}}) {
      edges {
        node {
          settings_id,
          start_health,
          start_energy,
          start_hand_size,
          draft_size,
          max_health,
          max_energy,
          max_hand_size,
        }
      }
    }
  }`

  const res = await request(dojoConfig.toriiUrl, document)

  return res?.darkshuffleGameSettingsModels?.edges[0]?.node
}

export async function getActiveGameIds(address) {
  const document = gql`
  {
    darkshuffleGameStartEventModels (where:{
      player_address:"${address}",
      season_idIN:[${dojoConfig.seasonId},0]
    }) {
      edges {
        node {
          game_id
        }
      }
    }
  }`

  const res = await request(dojoConfig.toriiUrl, document)

  return res?.darkshuffleGameStartEventModels?.edges.map(edge => edge.node.game_id)
}

export async function getActiveGame(game_id) {
  const document = gql`
  {
    darkshuffleGameModels (where:{
      game_id:"${game_id}"
    }) {
      edges {
        node {
          game_id,
          season_id,
          player_name,
          state,

          hero_health,
          hero_xp,
          monsters_slain,
          
          map_level,
          map_depth,
          last_node_id
        }
      }
    }
  }`

  const res = await request(dojoConfig.toriiUrl, document)

  return res?.darkshuffleGameModels?.edges[0]?.node
}

export async function getDraft(game_id) {
  const document = gql`
    {
    entity (id:"${getEntityIdFromKeys([BigInt(game_id)])}") {
      models {
        ... on darkshuffle_Draft {
          game_id,
          options,
          cards
        }
      }
    }
  }`

  const res = await request(dojoConfig.toriiUrl, document)

  return res?.entity.models.find(x => x.game_id)
}

export async function getGameEffects(game_id) {
  const document = gql`
  {
    darkshuffleGameEffectsModels(where:{game_id:"${game_id}"}) {
      edges {
        node {
          game_id,
          first_attack,
          first_health,
          first_cost,
          all_attack,
          hunter_attack,
          hunter_health,
          magical_attack,
          magical_health,
          brute_attack,
          brute_health,
          hero_dmg_reduction,
          hero_card_heal,
          card_draw,
          play_creature_heal,
          start_bonus_energy
        }
      }
    }
  }`

  const res = await request(dojoConfig.toriiUrl, document);

  return res?.darkshuffleGameEffectsModels?.edges[0]?.node;
}

export async function getMap(game_id, level) {
  const document = gql`
  {
    darkshuffleMapModels(where:{game_id:"${game_id}", level:${level}}) {
      edges {
        node {
          game_id,
          level,
          seed
        }
      }
    }
  }`

  const res = await request(dojoConfig.toriiUrl, document);

  return res?.darkshuffleMapModels?.edges[0]?.node;
}

export async function getBattleState(battle_id, game_id) {
  const document = gql`
  {
    entity (id:"${getEntityIdFromKeys([BigInt(battle_id), BigInt(game_id)])}") {
      models {
        ... on darkshuffle_Battle {
          battle_id
          game_id
          round

          hero {
            health
            max_health
            energy
          }

          monster {
            monster_id
            attack
            health
          }

          hand
          deck
          deck_index

          battle_effects { 
            enemy_marks
            hero_dmg_reduction
            next_hunter_attack_bonus
            next_hunter_health_bonus
            next_brute_attack_bonus
            next_brute_health_bonus
          }
        }
        ... on darkshuffle_Board {
          creature1 {
            card_id,
            attack,
            health,
          }
          creature2 {
            card_id,
            attack,
            health,
          }
          creature3 {
            card_id,
            attack,
            health,
          }
          creature4 {
            card_id,
            attack,
            health,
          }
          creature5 {
            card_id,
            attack,
            health,
          }
          creature6 {
            card_id,
            attack,
            health,
          }
        }
      }
    }
  }`

  const res = await request(dojoConfig.toriiUrl, document);

  const result = {
    battle: res?.entity.models.find(model => model.hero),
    board: res?.entity.models.find(model => model.creature1)
  };

  return result;
}

export async function getLeaderboard(seasonId, page) {
  let pageSize = 10;

  try {
    const document = gql`
    {
      darkshuffleGameModels (where: {season_id: ${seasonId}}, order:{field:hero_xp, direction:DESC}, limit:${pageSize}, offset:${pageSize * page}) {
        edges {
          node {
            player_name,
            hero_xp
          }
        }
      }
    }
  `
    const res = await request(dojoConfig.toriiUrl, document);

    return res?.darkshuffleGameModels?.edges.map(edge => edge.node);
  } catch (ex) {
    console.log(ex)
  }
}

export async function getDonations(seasonId, page) {
  let pageSize = 100;

  const document = gql`
  {
    darkshuffleDonationModels(where:{season_id:${seasonId}}, order:{field:AMOUNT, direction:DESC}, limit:${pageSize}, offset:${pageSize * page}) {
      edges {
        node {
          address
          name
          social
          amount
        }
      }
    }
  }
  `

  const res = await request(dojoConfig.toriiUrl, document);

  return res?.darkshuffleDonationModels?.edges.map(edge => edge.node) || [];
}