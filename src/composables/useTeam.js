import { ref } from 'vue'

const team = ref({
    id: null,
    name: '',
    type: '',
    description: '',
    avatar: '',
    createdAt: '',
    resource_count: 0,
    members_count: 0
})



export function useTeam() {
    return  team 
}