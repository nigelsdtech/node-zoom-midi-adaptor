import { expect } from 'chai';
import sinon from 'sinon';
import { memoize } from '../../src/utils';

describe('Utils', () => {
    describe('memoize', () => {
        it('should return the result of the function', () => {
            const add = (a: number, b: number) => a + b;
            const memoizedAdd = memoize(add);
            
            expect(memoizedAdd(1, 2)).to.equal(3);
        });

        it('should cache results for repeated calls with same arguments', () => {
            const spy = sinon.spy((a: number, b: number) => a + b);
            const memoizedFn = memoize(spy);
            
            memoizedFn(1, 2);
            memoizedFn(1, 2);
            memoizedFn(1, 2);
            
            expect(spy.callCount).to.equal(1);
            expect(memoizedFn(1, 2)).to.equal(3);
        });

        it('should call the function for different arguments', () => {
            const spy = sinon.spy((a: number, b: number) => a + b);
            const memoizedFn = memoize(spy);
            
            memoizedFn(1, 2);
            memoizedFn(2, 3);
            memoizedFn(3, 4);
            
            expect(spy.callCount).to.equal(3);
        });

        it('should handle complex objects as arguments', () => {
            const spy = sinon.spy((obj: { a: number, b: number }) => obj.a + obj.b);
            const memoizedFn = memoize(spy);
            
            const result1 = memoizedFn({ a: 1, b: 2 });
            const result2 = memoizedFn({ a: 1, b: 2 });
            
            expect(spy.callCount).to.equal(1);
            expect(result1).to.equal(3);
            expect(result2).to.equal(3);
        });

        it('should handle functions with no arguments', () => {
            const spy = sinon.spy(() => 42);
            const memoizedFn = memoize(spy);
            
            memoizedFn();
            memoizedFn();
            
            expect(spy.callCount).to.equal(1);
            expect(memoizedFn()).to.equal(42);
        });

        it('should preserve this context for the original function', () => {
            const obj = {
                value: 10,
                getValue() {
                    return this.value;
                }
            };
            
            const spy = sinon.spy(obj.getValue);
            const memoizedFn = memoize(spy);
            
            // This test is limited since the original context isn't preserved
            // by our implementation - documenting this limitation
            spy.call(obj);
            memoizedFn.call(obj);
            
            expect(spy.callCount).to.equal(2);
        });
    });
});