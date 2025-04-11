import { expect } from 'chai';
import 'mocha';
import { classifyMessageType, decodeMidiStatusMessage, decorateSysexMessage } from '../../src/midiUtils';
import { MidiMessageType } from '../../types/midiMessages.spec';

describe('midiUtils', () => {
    describe('classifyMessageType', () => {
        const testCases = [
            {
                name: 'should classify NoteOff message',
                input: 0x80,
                expected: MidiMessageType.NoteOff,
            },
            {
                name: 'should classify NoteOn message',
                input: 0x90,
                expected: MidiMessageType.NoteOn,
            },
            {
                name: 'should classify PolyphonicKeyPressure message',
                input: 0xA0,
                expected: MidiMessageType.PolyphonicKeyPressure,
            },
            {
                name: 'should classify ControlChange message',
                input: 0xB0,
                expected: MidiMessageType.ControlChange,
            },
            {
                name: 'should classify ProgramChange message',
                input: 0xC0,
                expected: MidiMessageType.ProgramChange,
            },
            {
                name: 'should classify ChannelPressure message',
                input: 0xD0,
                expected: MidiMessageType.ChannelPressure,
            },
            {
                name: 'should classify PitchBend message',
                input: 0xE0,
                expected: MidiMessageType.PitchBend,
            },
            {
                name: 'should classify SystemExclusive message',
                input: 0xF0,
                expected: MidiMessageType.SystemExclusive,
            },
            {
                name: 'should classify unknown message as Other',
                input: 0x70,
                expected: MidiMessageType.Other,
            },
        ];

        testCases.forEach(({ name, input, expected }) => {
            it(name, () => {
                expect(classifyMessageType(input)).to.equal(expected);
            });
        });
    });

    describe('decodeMidiStatusMessage', () => {
        const testCases = [
            {
                name: 'should decode ControlChange message on channel 4',
                input: [0xB3, 0x07, 0x64], // Example: [status, controller, value]
                expected: { messageType: MidiMessageType.ControlChange, channel: 3, data0: 0x07, data1: 0x64 }
            },
            {
                name: 'should decode ProgramChange message on channel 5',
                input: [0xC4, 0x45, 0x00], // Example: [status, program, unused]
                expected: { messageType: MidiMessageType.ProgramChange, channel: 4, data0: 0x45 }
            },
            {
                name: 'should decode SystemExclusive message',
                input: [0xF0, 0x01, 0x02], // Example: [status, manufacturer ID, data]
                expected: { messageType: MidiMessageType.SystemExclusive, channel: 0, data0: [0x01, 0x02] }
            },
        ];

        testCases.forEach(({ name, input, expected }) => {
            it(name, () => {
                expect(decodeMidiStatusMessage(input)).to.deep.equal(expected);
            });
        });
    });

    describe('decorateSysexMessage', () => {
        it('should wrap data in a valid System Exclusive message', () => {
            const data = [0x01, 0x02, 0x03];
            const sysexMessage = decorateSysexMessage(data);
            expect(sysexMessage).to.deep.equal([0xF0, 0x01, 0x02, 0x03, 0xF7]);
        });

        it('should handle empty data array', () => {
            const data: number[] = [];
            const sysexMessage = decorateSysexMessage(data);
            expect(sysexMessage).to.deep.equal([0xF0, 0xF7]);
        });
    });
});