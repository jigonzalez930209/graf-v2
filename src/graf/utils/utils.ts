import { createSecureContext } from 'tls'
import { open, save } from '@tauri-apps/plugin-dialog'
import { readFile, writeFile } from '@tauri-apps/plugin-fs'
import _ from 'lodash'
import { Store } from 'tauri-plugin-store-api'
import { read, utils, write } from 'xlsx'

import { File, IGraftState, ProcessFile } from '../interfaces/interfaces'
import { IGraftImpedanceType } from './../interfaces/interfaces'

// const filters = [
//   { name: "Excel Binary Workbook", extensions: ["xlsb"] },
//   { name: "Excel Workbook", extensions: ["xlsx"] },
//   { name: "Excel 97-2004 Workbook", extensions: ["xls"] },
//   // ... other desired formats ...
// ];

// async function saveFile(wb) {
//   /* show save file dialog */
//   const selected = await save({
//     title: "Save to Spreadsheet",
//     filters
//   });

//   /* Generate workbook */
//   const bookType = selected.slice(selected.lastIndexOf(".") + 1);
//   const d = write(wb, { type: "buffer", bookType });

//   /* save data to file */
//   await writeBinaryFile(selected, d);
// }

// async function openFile() {
//   /* show open file dialog */
//   const selected = await open({
//     title: "Open Spreadsheet",
//     multiple: false,
//     directory: false,
//     filters
//   });

//   /* read data into a Uint8Array */
//   const d = await readFile(selected);

//   /* parse with SheetJS */
//   const wb = read(d);
//   return wb;
// }

const COLORS = [
  '#2f4f4f',
  '#556b2f',
  '#8b4513',
  '#6b8e23',
  '#7f0000',
  '#708090',
  '#483d8b',
  '#008000',
  '#3cb371',
  '#bc8f8f',
  '#008080',
  '#b8860b',
  '#4682b4',
  '#d2691e',
  '#9acd32',
  '#00008b',
  '#32cd32',
  '#7f007f',
  '#8fbc8f',
  '#b03060',
  '#d2b48c',
  '#48d1cc',
  '#9932cc',
  '#ff4500',
  '#ffa500',
  '#ffd700',
  '#ffff00',
  '#c71585',
  '#0000cd',
  '#00ff00',
  '#00fa9a',
  '#dc143c',
  '#00bfff',
  '#f4a460',
  '#0000ff',
  '#a020f0',
  '#f08080',
  '#adff2f',
  '#ff6347',
  '#d8bfd8',
  '#ff00ff',
  '#f0e68c',
  '#6495ed',
  '#dda0dd',
  '#90ee90',
  '#add8e6',
  '#7b68ee',
  '#ee82ee',
  '#7fffd4',
  '#ff69b4',
]

export const PALETTES: Record<string, Array<string>> = {
  '1': [
    '#167288',
    '#8cdaec',
    '#b45248',
    '#d48c84',
    '#a89a49',
    '#d6cfa2',
    '#3cb464',
    '#9bddb1',
    '#643c6a',
    '#836394',
  ],
  '2': [
    '#d8495f',
    '#cc3284',
    '#904493',
    '#8633d0',
    '#5d73d7',
    '#32909e',
    '#328c7b',
    '#41945e',
    '#ae7b38',
    '#d25935',
  ],
  '3': [
    '#03a8a0',
    '#039c4b',
    '#66d313',
    '#fedf17',
    '#ff0984',
    '#21409a',
    '#04adff',
    '#e48873',
    '#f16623',
    '#f44546',
  ],
  '4': [
    '#326cac',
    '#2c6099',
    '#275486',
    '#214873',
    '#1c3c60',
    '#16304c',
    '#112439',
    '#0b1826',
    '#050c13',
    '#000000',
  ],
  '5': [
    '#d0021a',
    '#eaac25',
    '#f1ec18',
    '#7dd41b',
    '#427601',
    '#bbe786',
    '#51e2c1',
    '#4a92d6',
    '#8915ff',
    '#bf0ee0',
  ],
  '6': [
    '#907e63',
    '#c57644',
    '#669264',
    '#8b88f8',
    '#915f6d',
    '#b3abb6',
    '#d1b791',
    '#c5cbe1',
    '#e3eebf',
    '#ebe5d5',
  ],
  '7': [
    '#f9986f',
    '#884400',
    '#7295c9',
    '#00789b',
    '#353d75',
    '#98b489',
    '#b7a2cc',
    '#dcbfac',
    '#dac5b1',
    '#d8dde6',
  ],
  // custom: [],
}

const COLUMNS_IMPEDANCE = ['Time', 'Frequency', 'Module', 'Face', 'ZR', 'ZI']

const COLUMNS_VOLTAMETER = ['Time', 'Voltage', 'Current']

const IMPEDANCE_TYPE: IGraftImpedanceType[] = ['Bode', 'Nyquist', 'ZiZrVsFreq']

const IMPEDANCE_IMPORT_COLUMNS = ['Frequency', 'Module', 'Phase']

export {
  COLORS,
  COLUMNS_IMPEDANCE,
  COLUMNS_VOLTAMETER,
  IMPEDANCE_TYPE,
  IMPEDANCE_IMPORT_COLUMNS,
}
