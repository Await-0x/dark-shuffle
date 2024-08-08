/* global BigInt */
import { getEntityIdFromKeys, hexToAscii, setComponentFromEvent } from "@dojoengine/utils";
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
  const name = translateName(event[0]);
  const keysNumber = parseInt(event[1]);
  const keys = event.slice(2, 2 + keysNumber).map((key) => BigInt(key));
  const entityId = getEntityIdFromKeys(keys);

  if (!components[name]) return;

  const component = components[name];
  let values = [...event.slice(2, 2 + keysNumber), ...event.slice(keysNumber + 3)];

  const parsedFields = Object.keys(component).reduce((acc, key, index) => {
    if (component[key] === 'array') {
      return { ...acc, [key]: values.splice(index+1, parseInt(values[index])).map(x => parseInt(x)) }
    }

    return { ...acc, [key]: parseData(values[index], component[key]) }
  }, {})

  return {
    entityId,
    componentName: name,
    ...parsedFields
  }
}