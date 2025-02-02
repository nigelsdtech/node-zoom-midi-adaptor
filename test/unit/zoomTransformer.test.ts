import { expect } from 'chai';
import 'mocha';
import { transformMessage } from '../../src/zoomTransformer';
import { MidiStatusMessage, ChangeControlMap } from '../../types/midiMessages.spec';


describe('transformMessage', () => {

    const changeControlMaps: ChangeControlMap[] = [{
            ccNum: 0,
            action: 'tunerOnOff'
        },{
            ccNum: 1,
            action: 'effectOnOff',
            effectPosition: 0x01
        },{
            ccNum: 2,
            action: 'changeEffectParam',
            effectPosition: 0x01,
            paramNum: 0x02
        },{
            ccNum: 3,
            action: 'changeEffectParam',
            effectPosition: 0x01,
            paramNum: 0x04
        },{
            ccNum: 4,
            action: 'effectOnOff',
            effectPosition: 0x02
        },{
            ccNum: 5,
            action: 'changeEffectParam',
            effectPosition: 0x02,
            paramNum: 0x02
    }]


    const tests: {
        desc: string,
        rawMessage: MidiStatusMessage,
        expected: MidiStatusMessage
    }[] = [{
        desc: 'should set tuner on',
        rawMessage: [178, 0, 75],
        expected: [0xB0, 74, 75]
    },{
        desc: 'should set tuner off',
        rawMessage: [178, 0, 30],
        expected: [0xB0, 74, 30]
    },{
        desc: 'should set effect in position 1 on',
        rawMessage: [178, 1, 127],
        //                                      effct, parm, val  
        expected: [0xF0, 0x52, 0x00, 0x58, 0x31, 0x01, 0x00, 1, 0x00, 0xF7]
    },{
        desc: 'should set param 1 on effect in position 1',
        rawMessage: [178, 2, 40],
        //                                      effct, parm, val  
        expected: [0xF0, 0x52, 0x00, 0x58, 0x31, 0x01, 0x02, 40, 0x00, 0xF7]
    },{
        desc: 'should set param 2 on effect in position 1',
        rawMessage: [178, 3, 27],
        //                                      effct, parm, val  
        expected: [0xF0, 0x52, 0x00, 0x58, 0x31, 0x01, 0x04, 27, 0x00, 0xF7]
    },{
        desc: 'should set effect in position 1 off',
        rawMessage: [178, 1, 0],
        //                                      effct, parm, val  
        expected: [0xF0, 0x52, 0x00, 0x58, 0x31, 0x01, 0x00, 0, 0x00, 0xF7]
    },{
        desc: 'should set effect in position 2 on',
        rawMessage: [178, 4, 127],
        //                                      effct, parm, val  
        expected: [0xF0, 0x52, 0x00, 0x58, 0x31, 0x02, 0x00, 1, 0x00, 0xF7]
    },{
        desc: 'should set param 1 on effect in position 2',
        rawMessage: [178, 5, 33],
        //                                      effct, parm, val  
        expected: [0xF0, 0x52, 0x00, 0x58, 0x31, 0x02, 0x02, 33, 0x00, 0xF7]
    },{
        desc: 'should set effect in position 2 off',
        rawMessage: [178, 4, 10],
        //                                      effct, parm, val
        expected: [0xF0, 0x52, 0x00, 0x58, 0x31, 0x02, 0x00,  0, 0x00, 0xF7]
    },{
        desc: 'should set effect in position 2 off again to prove memoization works',
        rawMessage: [178, 4, 10],
        //                                      effct, parm, val
        expected: [0xF0, 0x52, 0x00, 0x58, 0x31, 0x02, 0x00,  0, 0x00, 0xF7]
    },
    {
        desc: 'should return an unrecognized CC unparsed',
        rawMessage: [178, 20, 10],
        expected: [178, 20, 10]
    },{
        desc: 'should return a PC message unparsed',
        rawMessage: [194, 3],
        expected: [194, 3]
    },{
        desc: 'should return a PC message unparsed again to prove memoization works',
        rawMessage: [194, 3],
        expected: [194, 3]
    }]

    tests.forEach(({ desc, rawMessage, expected }) => {
        it(desc, () => {
            const result = transformMessage(rawMessage, changeControlMaps)
            expect(result).to.deep.eql(expected);
        });
    });
});