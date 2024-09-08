import useUserStore from "@/store/user.store";

export default (isAdmin) => {
    const userStore = useUserStore();
    return userStore.user.role === isAdmin;
};