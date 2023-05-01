import { collab } from '@codemirror/collab';
import CollabPlugin from './CollabPlugin';

export const collabExtension = (startVersion) => {
  return [
    collab({ startVersion }),
    CollabPlugin
  ];
}