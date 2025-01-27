import { expect } from 'chai';
import 'mocha';
import { transformCCMessage } from '../../src/zoomTransformer';
import { MidiStatusMessage, ChangeControlMap } from '../../types/midiMessages.spec';


describe('transformMessage', () => {

    const changeControlMaps: ChangeControlMap[] = [{
            ccNum: 0,
            effectPosition: 0x01,
            effectInternalRef: 0x00
        },{
            ccNum: 1,
            effectPosition: 0x01,
            effectInternalRef: 0x02
        },{
            ccNum: 2,
            effectPosition: 0x01,
            effectInternalRef: 0x04
    }]


    const tests: {
        desc: string,
        data0: number,
        data1: number,
        expected: MidiStatusMessage
    }[] = [
        {
            desc: 'should set pitch shift off',
            data0: 0,
            data1: 0,
            expected: [0xF0, 0x52, 0x00, 0x58, 0x31, 0x01, 0x00, 0, 0x00, 0xF7]
        },
        {
            desc: 'should set pitch shift on',
            data0: 0,
            data1: 1,
            expected: [0xF0, 0x52, 0x00, 0x58, 0x31, 0x01, 0x00, 1, 0x00, 0xF7]
        },
        {
            desc: 'should set param 1 on pitch shift',
            data0: 1,
            data1: 40,
            expected: [0xF0, 0x52, 0x00, 0x58, 0x31, 0x01, 0x02, 40, 0x00, 0xF7]
        },
        {
            desc: 'should set param 3 on pitch shift',
            data0: 2,
            data1: 50,
            expected: [0xF0, 0x52, 0x00, 0x58, 0x31, 0x01, 0x04, 50, 0x00, 0xF7]
        },
        {
            desc: 'should return empty array for unknown CC',
            data0: 99,
            data1: 0,
            expected: []
        }
    ]

    tests.forEach(({ desc, data0, data1, expected }) => {
        it(desc, () => {
            const result = transformCCMessage(data0, data1, changeControlMaps)
            expect(result).to.eql(expected);
        });
    });
});