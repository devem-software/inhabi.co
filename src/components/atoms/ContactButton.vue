<template>
  <a
    :href="`https://wa.me/${WA || phone}?text=${encodeURIComponent(message)}`"
    target="_blank"
    rel="noopener"
    aria-label="WhatsApp"
    class="btn btn__big btn__contact btn__float "
    >{{ t.ag.okWa }}</a
  >
</template>
<script setup>
import {t,WA} from '@/composables/useInhabiStore'
defineProps({
  message: {
    type: String,
    default:null
  },
  phone: {
    type: Number,
    default: null
  }
})
</script>
<style scoped lang="scss">

.btn__float {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 10;
  color: var(--dark);
  font-family: var(--font-classic) !important;
  font-weight: 500;
}
.btn__float:hover {
  background: var(--bg-whatsapp);
}
</style>
