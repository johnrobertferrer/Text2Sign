<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-help-circle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Help</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Text2Sign</v-toolbar-title>
      <v-autocomplete
        v-model="select"
        :loading="loading"
        :items="options"
        :search-input.sync="search"
        cache-items
        class="mx-6"
        flat
        hide-no-data
        hide-details
        label="Search for a sign language..."
        solo-inverted
      ></v-autocomplete>
    </v-app-bar>

    <v-content>
      <v-container
        class="fill-height"
        fluid
      >

      <v-alert
        color="primary"
        dark
        icon="mdi-alert-circle"
        border="bottom"
        prominent
        width="100vw"
        v-show="processing"
      >
        Loading...
        <v-progress-linear
      indeterminate
      color="white"
    ></v-progress-linear>
      </v-alert>

    <v-row v-show="processing">
      <v-col
        v-for="card in [1,2,3,4,5,6,7,8,9,10]"
        cols="12"
        md="6"
        lg="4"
      >
        <v-skeleton-loader
          type="card"
        ></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-container>
      <v-row dense v-show="!processing">
        <v-col
          v-for="card in availableCards"
          :key="card.title"
          :cols="card.flex"
          md="6"
          lg="4"
        >
          <custom-card 
            :title="card.title"
            :src="card.src"
            :id="card.id"
            :lazysrc="card.lazySrc"
          />
        </v-col>
      </v-row>
      </v-container>

      <v-btn class="my-3" large block color="primary" @click.native="addLimit" v-show="!processing && availableCards.length == pagination.limit">
        <v-icon dark class="mr-2" >
          mdi-plus-circle
        </v-icon>
        Load more? 
      </v-btn>

      </v-container>
    </v-content>

    <v-footer 
      color="indigo"
      app
      padless
    >
      <v-col
        class="text-center white--text"
        cols="12"
      >
        &copy; {{ new Date().getFullYear() }} — <strong> John Ferrer</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
  import CustomCard from './components/CustomCard.vue';

  export default {
    components: {
      CustomCard
    },
    data() {
      return {
        drawer: null,
        active: '',
        processing: true,
        giphy: {
            api_key: 'N6fDSNgTp2KwnvoO8VNUz10tsryx1fTS',
            q: 'sign with robert',
            limit: 1000,
            offset: 0,
            rating: 'g',
            lang: 'en'
        },
        cards: [],
        loading: false,
        options: [],
        search: null,
        select: null,
        pagination: {
          limit: 10
        }
      }
    },
    mounted() {
      this.fetchGIFS();
    },
    watch: {
      search (val) {
        if(this.search == "" || this.search == " ") {
          this.select = null;
        }

        val && val !== this.select && this.querySelections(val);
      },
    },
    computed: {
      gifsOptions: function() {
        return this.cards.map(card => card.title);
      },

      availableCards: function() {
        let search = this.search;

        if (search === '' || search === null) {
          return this.cards.slice(0, this.pagination.limit);
        }

        return this.cards.filter(function (card) { return card.title.includes(search) })
          .slice(0, this.pagination.limit);
      }
    },
    methods: {
      addLimit() {
        this.pagination.limit = this.giphy.limit - this.pagination.limit > 0 
          ? this.pagination.limit + 10
          : this.giphy.limit;
      },

      fetchGIFS() {
        this.processing = true;
        let url = 'https://api.giphy.com/v1/gifs/search';
        Vue.axios.get(url, { params: this.giphy }).then((response) => {
          this.rebuildCards(response.data.data);
        })
      },

      rebuildCards(data) {
        let cards = [];

        data.forEach(card => {
          let title = this.getCardTitle(card);

          if (title != ' ' && title != '') {
            if (!cards.some(element => element.title === title)) {
              cards.push(
                {
                  id: card.id,
                  src: card.images.fixed_height.url,
                  lazySrc: card.images.fixed_width_small_still.url,
                  title: title,
                  flex: 12
                }
              );
            }
          }
        });

        this.cards = cards;

        setTimeout(() => {
          this.processing = false;
        }, this.giphy.limit);
      },

      getCardTitle(card) {
        let title = card.title.toLowerCase();
        title = title.replace('gif by sign with robert', '');
        title = title.replace('sign with robert', '');
        title = title.replace('sign language', '');
        title = title.replace('gif', '');
        title = title.replace('asl', '');
        title = title.replace('american ', '');
        title = title.charAt(0) === ' ' ? title.substr(1) : title;
        title = title.charAt(title.length-1) === ' ' ? title.substr(0, title.length-1) : title;

        return title;
      },

      querySelections (v) {
        this.loading = true
        // Simulated ajax query
        setTimeout(() => {
          this.options = this.gifsOptions.filter(e => {
            return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
          })
          this.loading = false
        }, 500)
      },
    }
  }

</script>
