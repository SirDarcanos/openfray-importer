import { OptionDefaults, Options } from "@/utils/options";
import { storage } from "wxt/storage";

export default defineBackground(() => {
  // Seed any unset options with their defaults. There is no save/POST path —
  // conversion happens in the popup and the result is copied/downloaded by the user.
  storage.getItems(Object.values(Options)).then((values) => {
    for (const key in OptionDefaults) {
      const stored = values?.find((v) => v.key === key);
      if (!stored) {
        storage.setItem(key as Options, OptionDefaults[key as Options]);
      }
    }
  });
});
