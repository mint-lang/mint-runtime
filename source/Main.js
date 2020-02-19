import { Fragment, h, render } from "preact";

import {
  format,
  startOfMonth,
  startOfWeek,
  startOfDay,
  endOfMonth,
  endOfWeek,
  endOfDay,
  addMonths,
  eachDayOfInterval as eachDay,
  formatDistanceStrict as distanceInWordsStrict
} from "date-fns";

import {
  insertStyles,
  update,
  navigate,
  normalizeEvent,
  at,
  array,
  style
} from "./Utils";
import { compare } from "./Compare";
import { Equals } from "./Symbols";

import EmbeddedProgram from "./EmbeddedProgram";
import { Record, create } from "./Record";
import TestContext from "./TestContext";
import Component from "./Component";
import Provider from "./Provider";
import Program from "./Program";
import Decoder from "./Decoder";
import encode from "./Encoder";
import Module from "./Module";
import Store from "./Store";
import Enum from "./Enum";
import { createPortal } from "./Portals";

import "./Ext";

export default enums => {
  const DecoderWithEnums = Decoder(enums);

  return {
    program: new (Program(enums))(),

    normalizeEvent: normalizeEvent,
    insertStyles: insertStyles,
    navigate: navigate,
    compare: compare,
    update: update,
    array: array,
    style: style,

    encode: encode(enums),
    at: at(enums),

    EmbeddedProgram: EmbeddedProgram,
    TestContext: TestContext,
    Component: Component,
    Provider: Provider,
    Module: Module,
    Store: Store,

    Decoder: DecoderWithEnums,
    // TODO : Refactor `eachDay as eachDayOfInterval`, `distanceInWordsStrict as formatDistanceStrict` in `mint/core/Time`
    DateFNS: {
      format,
      startOfMonth,
      startOfWeek,
      startOfDay,
      endOfMonth,
      endOfWeek,
      endOfDay,
      addMonths,
      eachDay,
      distanceInWordsStrict
    },
    Record: Record,
    Enum: Enum,

    Nothing: enums.nothing,
    Just: enums.just,

    Err: enums.err,
    Ok: enums.ok,

    createRecord: create(DecoderWithEnums, enums),
    Preact: {
      h,
      render,
      Fragment,
      createPortal
    },

    Symbols: {
      Equals: Equals
    }
  };
};
