<template>
  <div :id="'custom-card-'+id" class="custom-card">
    <v-skeleton-loader
      type="card"
      v-show="loading">
    </v-skeleton-loader>

    <v-card v-show="!loading">
      <v-img
        :lazy-src="lazysrc"
        :src="src"
        class="white--text align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" 
        height="100%"
      >
        <v-card-title v-text="title"></v-card-title>
      </v-img>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-bookmark</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'CustomCard',
    props: [
      'title',
      'src',
      'lazysrc',
      'id'
    ],
    data: () => ({
      loading: true,
    }),
    created() {
      this.loading = true;
    },
    mounted() {
      let that = this;
      let card = document.getElementById('custom-card-' + that.id);

      this.checkIfLoaded(card);
    },
    methods: {
      checkIfLoaded(event) {
        let that = this;

        setTimeout(() => {
          Vue.set(that, 'loading', false);
        }, 350);
      }
    }
  }
</script>
