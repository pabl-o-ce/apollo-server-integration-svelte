import type { RequestEvent } from '@sveltejs/kit';

const getBody = async (event: RequestEvent) => {
    const { request } = event
    try {
        const contentType = request.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            return request.json();
        } else {
            return request.text();
        }
        
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Failed to parse JSON request body');
        } else {
            throw new Error('Failed to read request body');
        }
    }
};

export { getBody };
