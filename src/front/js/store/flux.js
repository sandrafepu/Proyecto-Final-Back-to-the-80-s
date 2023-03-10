const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      favorites: [],
      token: null,
      uid: null,
      username: null
    },

    actions: {
      handleFavorite: (id, token) => {
        fetch(process.env.BACKEND_URL + '/api/favorites', {
          method: 'POST',
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({"id": id })
        })
        
        .then(res => res.json())
        .then(data => { console.log(data)})
        .catch(err => console.log(err))
      },
      
      getFavorites: (token) => {
        fetch(process.env.BACKEND_URL + '/api/albums',{
          method: 'GET',
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          }
        })
        .then(res => res.json())
        .then(data => console.log("This is getFavorites Flux", data.favorites))
        .catch(err => console.log(err))
      },

      getUser: (token) => {
        fetch(process.env.BACKEND_URL + '/api/user', {
          method: 'GET',
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          }
        })
        .then(res => res.json())
        .then(data => {
          setStore({uid: data.id})
        })
        .catch(err => console.log(err))
      },

      addFavorite: (newFavorite) => {
        const store = getStore();
        setStore({ favorites: [...store.favorites, newFavorite] });
      },

      deleteFavorite: (item) => {
        const store = getStore();
        let newFav = store.favorites.filter((i) => item !== i);
        setStore({ favorites: newFav });
      },

      syncTokenFromSessionStore: () => {
        const token = sessionStorage.getItem("token");
        if (token && token !== "" && token !== undefined)
          setStore({ token: token });
      },

      logout: () => {
        sessionStorage.removeItem("token");
        setStore({ token: null });
      },

      login: async (username, password) => {
        let requestOptions = {
          method: "POST",
          headers: {
            Content_Type: "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        };

        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/token",
            requestOptions
          );
          if (resp.status !== 200) {
            alert("There was some error");
            return false;
          }

          const data = await resp.json();
          sessionStorage.setItem("token", data.access_token);
          setStore({ token: data.access_token} );
          setStore({ username: username} );
          return true;
        } catch (error) {
        }
      },
    },
  };
};

export default getState;
