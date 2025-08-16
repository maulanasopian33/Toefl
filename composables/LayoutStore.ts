// composables/useLayoutStore.ts

// Tentukan tipe data untuk state
interface LayoutState {
  title: string;
  description: string;
  loginAs : boolean;
  navlogin : boolean,
  navregister : boolean
}

export const useLayoutStore = () => {
  // Gunakan type assertion agar Nuxt tahu tipe data dari state ini
  const layoutState: Ref<LayoutState> = useState('layoutState', () => ({
    title: 'Judul Default',
    description: 'Deskripsi Default',
    loginAs : true,
    navregister : true,
    navlogin : true
  }));

  // Tambahkan tipe data pada parameter
  const setTitle = (newTitle: string) => {
    layoutState.value.title = newTitle;
  };

  const setDescription = (newDescription: string) => {
    layoutState.value.description = newDescription;
  };

  const HideLoginAs = () => {
    layoutState.value.loginAs = false;
  };
  
  const NavLogin = (value : boolean) => {
    layoutState.value.navlogin = value;
  };
  
  const NavRegister = (value : boolean) => {
    layoutState.value.navregister = value;
  };

  return {
    state: layoutState,
    setTitle,
    setDescription,
    HideLoginAs,
    NavLogin,
    NavRegister
  };
};