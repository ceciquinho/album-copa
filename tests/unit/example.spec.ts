import { shallowMount } from '@vue/test-utils';
import Tab1Page from '@/views/Tab1Page.vue';
import { describe, expect, test, vi } from 'vitest';

vi.mock('@ionic/vue', () => ({
  IonContent: { template: '<main><slot /></main>' },
  IonPage: { template: '<section><slot /></section>' },
}));

describe('Tab1Page.vue', () => {
  test('renders the album page shell', () => {
    const wrapper = shallowMount(Tab1Page, {
      global: {
        stubs: {
          AppHeader: true,
          StickerList: true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
