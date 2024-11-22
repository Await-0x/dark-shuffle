/* global BigInt */
import { hexToAscii } from "@dojoengine/utils";
import { components, translateName } from "./components.js";

function parseData(value, type) {
  switch (typeof type) {
    case 'string':
      return hexToAscii(value)
    case 'number':
      return parseInt(value)
    case 'boolean':
      return Boolean(parseInt(value))
    default:
      return value
  }
}

export function translateEvent(event) {
  const name = translateName(event.keys[1]);
  const data = event.data;

  const keysNumber = parseInt(data[0]);

  if (!components[name]) return;
  const component = components[name];

  let values = [...data.slice(1, 1 + keysNumber), ...data.slice(keysNumber + 2)];

  const parsedFields = Object.keys(component).reduce((acc, key, index) => {
    if (component[key] === 'array') {
      return { ...acc, [key]: values.splice(index + 1, parseInt(values[index])).map(x => parseInt(x)) }
    }

    if (component[key] === 'Creature') {
      let creature = values.splice(index + 1, 4)

      return {
        ...acc, [key]: {
          cardId: parseInt(values[index]),
          cost: parseInt(creature[0]),
          attack: parseInt(creature[1]),
          health: parseInt(creature[2]),
          creatureType: parseInt(creature[3]),
        }
      }
    }

    return { ...acc, [key]: parseData(values[index], component[key]) }
  }, {})

  return {
    componentName: name,
    ...parsedFields
  }
}