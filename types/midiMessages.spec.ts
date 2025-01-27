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


export interface DecodedMidiMessage {
  channel: number;
  messageType: MidiMessageType;
  data0: number;
  data1: number;
}

export type MidiStatusMessage = number[]

export type ChangeControlMap = {
  ccNum: number,
  effectPosition: number,
  effectInternalRef: number
}