<template>
  <nav class="nav">
    <router-link to="/" class="nav__brand">
      <LogoComponent class="nav__brand_logo" icon text />
    </router-link>

    <div class="nav__actions">
      <router-link to="/" class="nav__actions_action btn btn__outline btn__small">{{t.nav.return}}</router-link>
      <router-link v-if="props.cotizar" to="/cotiza" class="nav__actions_action btn btn__small">
        {{ t.nav.cotizar }}
      </router-link>
    </div>
  </nav>
</template>
<script setup>
import LogoComponent from '@/components/LogoComponent.vue'
import { t } from '@/composables/useInhabiStore'
const props = defineProps({
  cotizar: {
    type: Boolean,
    default: false
  }
})
</script>
<style scoped lang="scss">

.nav{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem clamp(20px, 4vw, 56px);
  background: var(--dark-soft);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(243, 240, 233, 0.1);
  z-index: 60;
  &__brand{
    &_logo{
      height: 1.25rem;
      width: auto;
      display: block;
      @media (min-width:42rem){
        height:1.5rem;
      }
    }
  }
  &__actions{
    display: flex;
    align-items: center;
    gap: 1rem;
    &_action{
      margin: initial;
    }
  }
}

</style>
