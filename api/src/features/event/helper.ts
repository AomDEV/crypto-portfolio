export function createEvent (event: string, data: any, merged: boolean = false) {
    if (merged) {
        const _data = {
            event,
            data,
        };
        return ({ data: _data }) as MessageEvent;
    }
    return new MessageEvent(event, { data });
}