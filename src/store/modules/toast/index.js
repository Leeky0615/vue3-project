export default {
    namespaced: true,
    state: {
        toasts: [],
    },
    mutations: {
        ADD_TOAST(state, payload) {
            state.toasts.push(payload);
        },
        REMOVE_TOAST(state) {
            state.toasts.shift();
        }
    },
    actions: {
        triggerToast({commit}, message, type = 'success') {
            commit('ADD_TOAST', {
                id: Date.now(),
                message,
                type
            })

            setTimeout(() => {
                commit('REMOVE_TOAST');
            }, 5000)
        }
    },
    getters: {
        toastMessageWithSmile(state) {
            return state.message + '^_^';
        }
    },
}