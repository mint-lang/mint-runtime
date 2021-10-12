import { Fragment, h, render } from "preact";
import { createPortal } from "preact/compat";
import register from "./Register.js";

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
  formatDistanceStrict as distanceInWordsStrict,
} from "date-fns";

import {
  insertStyles,
  update,
  navigate,
  normalizeEvent,
  at,
  array,
  style,
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
import Encoder from "./Encoder";
import Module from "./Module";
import Store from "./Store";
import Enum from "./Enum";

import "./Ext";

export default (enums) => {
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

    at: at(enums),

    EmbeddedProgram: EmbeddedProgram,
    TestContext: TestContext,
    Component: Component,
    Provider: Provider,
    Module: Module,
    Store: Store,

    Decoder: DecoderWithEnums,
    Encoder: Encoder(enums),
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
      distanceInWordsStrict,
    },
    Record: Record,
    Enum: Enum,

    Nothing: enums.nothing,
    Just: enums.just,

    Err: enums.err,
    Ok: enums.ok,

    createRecord: create(DecoderWithEnums, enums),
    createPortal: createPortal,
    register: register,
    createElement: h,
    React: {
      Fragment: Fragment,
    },
    ReactDOM: {
      unmountComponentAtNode: (root) => render(null, root),
      render: render,
    },
    Symbols: {
      Equals: Equals,
    },
  };
};
