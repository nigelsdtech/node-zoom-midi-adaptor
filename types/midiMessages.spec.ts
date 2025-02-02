export enum MidiMessageType {
  NoteOff = 'noteOff',
  NoteOn = 'noteOn',
  PolyphonicKeyPressure = 'polyphonicKeyPressure',
  ControlChange = 'controlChange',
  ProgramChange = 'programChange',
  ChannelPressure = 'channelPressure',
  PitchBend = 'pitchBend',
  SystemExclusive = 'systemExclusive',
  Other = 'other'
}


export type DecodedMidiMessage = {
  channel: number,
  messageType: MidiMessageType.ProgramChange,
  data0: number
} | {
  channel: number,
  messageType: MidiMessageType.SystemExclusive,
  data0: number[]
} | {
  channel: number,
  messageType: Exclude<MidiMessageType, MidiMessageType.ProgramChange | MidiMessageType.SystemExclusive>,
  data0: number,
  data1: number
}


export type MidiStatusMessage = number[]

export type ChangeControlMap = {
  ccNum: number,
  action: 'changeEffectParam',
  effectPosition: number,
  paramNum: number
} | {
  ccNum: number,
  action: 'effectOnOff',
  effectPosition: number
} | {
  ccNum: number,
  action: 'tunerOnOff'
}