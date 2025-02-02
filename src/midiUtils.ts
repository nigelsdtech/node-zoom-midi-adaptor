import { MidiMessageType, DecodedMidiMessage, MidiStatusMessage } from '../types/midiMessages.spec';
import { memoize } from 'lodash';

// Function that receives a number and parses it into a 
export function classifyMessageType(status: number): MidiMessageType {
    const messageType = status & 0xF0;
    switch (messageType) {
        case 0x80: return MidiMessageType.NoteOff;
        case 0x90: return MidiMessageType.NoteOn;
        case 0xA0: return MidiMessageType.PolyphonicKeyPressure;
        case 0xB0: return MidiMessageType.ControlChange;
        case 0xC0: return MidiMessageType.ProgramChange;
        case 0xD0: return MidiMessageType.ChannelPressure;
        case 0xE0: return MidiMessageType.PitchBend;
        case 0xF0: return MidiMessageType.SystemExclusive;
        default: return MidiMessageType.Other;
    }
}

// Process raw MIDI message into a structured format
// So far proper implementations have only been made for ProgramChange, SystemExclusive, and ControlChange.
export const decodeMidiStatusMessage = memoize((rawMessage: MidiStatusMessage): DecodedMidiMessage => {
    const [status, ...data] = rawMessage;

    const channel = status & 0x0F;
    const messageType = classifyMessageType(status);

    switch (messageType) {
        case MidiMessageType.ProgramChange:
            return {
                channel,
                messageType,
                data0: data[0]
            };
        case MidiMessageType.SystemExclusive:
            return {
                channel,
                messageType,
                data0: data
            };
        default:
            return {
                channel,
                messageType,
                data0: data[0],
                data1: data[1]
            };
    }
});

export function decorateSysexMessage(data: number[]): MidiStatusMessage {
    return [0xF0, ...data, 0xF7]
}