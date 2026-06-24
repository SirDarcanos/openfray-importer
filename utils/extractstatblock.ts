import cash, { Cash } from "cash-dom";
import { descriptionToMarkdown } from "./descriptionToMarkdown";
import { StatBlock, AbilityScores, NameAndContent } from "./statblock";
import { AllOptions, Options } from "./options";
import { get2024StatBlock } from "./get2024statblock";

export const extractStatBlock = (options: AllOptions) => {
  const doc = cash(document);

  const statBlock2024Elements = doc.find(".mon-stat-block-2024");
  if (statBlock2024Elements.length > 0) {
    return get2024StatBlock(options, doc, statBlock2024Elements);
  }

  const statBlockElements = doc.find(".mon-stat-block");

  if (statBlockElements.length > 0) {
    const statBlockElement = statBlockElements.first();
    const statBlock: StatBlock = {
      Source: getSource(
        doc.find(".monster-source"),
        options[Options.IncludePageNumberWithSource] == "on"
      ),
      Name: getName(statBlockElement),
      Type: getType(statBlockElement),
      HP: getHitPoints(statBlockElement),
      AC: getArmorClass(statBlockElement),
      Abilities: getAbilities(statBlockElement),
      Speed: getDelimitedStrings(statBlockElement, "Speed"),
      // InitiativeModifier?: number,
      // InitiativeSpecialRoll?: "advantage" | "disadvantage" | "take-ten",
      // InitiativeAdvantage?: boolean,
      DamageVulnerabilities: getDelimitedStrings(
        statBlockElement,
        "Damage Vulnerabilities"
      ),
      DamageResistances: getDelimitedStrings(
        statBlockElement,
        "Damage Resistances"
      ),
      DamageImmunities: getDelimitedStrings(
        statBlockElement,
        "Damage Immunities"
      ),
      ConditionImmunities: getDelimitedStrings(
        statBlockElement,
        "Condition Immunities"
      ),
      Saves: getDelimitedModifiers(statBlockElement, "Saving Throws"),
      Skills: getDelimitedModifiers(statBlockElement, "Skills"),
      Senses: getDelimitedStrings(statBlockElement, "Senses"),
      Languages: getDelimitedStrings(statBlockElement, "Languages"),
      Challenge: getChallenge(statBlockElement),
      Xp: getXp(statBlockElement),
      Traits: getPowers(statBlockElement, "Traits"),
      Actions: getPowers(statBlockElement, "Actions"),
      Reactions: getPowers(statBlockElement, "Reactions"),
      LegendaryActions: getPowers(statBlockElement, "Legendary Actions"),
      BonusActions: getPowers(statBlockElement, "Bonus Actions"),
      MythicActions: getPowers(statBlockElement, "Mythic Actions"),
      ImageURL: doc.find(".details-aside .image a").attr("href") || "",
      Description: getDescription(doc, options),
      Player: "",
    };

    return statBlock;
  }

  return null;
};

function getSource(element: Cash, includePageNumber: boolean) {
  const source = element.text().replace(/\s+/g, " ").replace(" ,", ",").trim();
  if (includePageNumber) {
    return source;
  } else {
    return source.split(",")[0];
  }
}

/** The monster's description block, converted to markdown, with an optional link
 *  back to the source page. */
function getDescription(doc: Cash, options: AllOptions) {
  let retVal = "";
  if (options[Options.IncludeDescription] === "on") {
    retVal = descriptionToMarkdown(
      doc.find(".mon-details__description-block-content")
    );
  }
  if (options[Options.IncludeLink] === "on")
    retVal += `\n\n[See this creature on DDB.](${document.location.href})`;

  return retVal.trim();
}

function getName(element: Cash) {
  return element.find(".mon-stat-block__name a").text().trim();
}

function getType(element: Cash) {
  return element.find(".mon-stat-block__meta").text().trim();
}

function getArmorClass(element: Cash) {
  return getAttribute(element, "Armor Class");
}

function getHitPoints(element: Cash) {
  return getAttribute(element, "Hit Points");
}

function getAttribute(element: Cash, attributeName: string) {
  const label = element
    .find(".mon-stat-block__attribute-label")
    .filter((_, e: Element) => e.innerHTML.trim() == attributeName)
    .first();

  const value = parseInt(
    label.parent().find(".mon-stat-block__attribute-data-value").text().trim()
  );
  const notes = label
    .parent()
    .find(".mon-stat-block__attribute-data-extra")
    .text()
    .trim();
  return {
    Value: value,
    Notes: notes,
  };
}

function getAbilities(element: Cash): AbilityScores {
  return {
    Str: getAbility(element, "str"),
    Dex: getAbility(element, "dex"),
    Con: getAbility(element, "con"),
    Int: getAbility(element, "int"),
    Wis: getAbility(element, "wis"),
    Cha: getAbility(element, "cha"),
  };
}

function getAbility(element: Cash, ability: string) {
  let score = 10;
  const scoreText = element
    .find(`.ability-block__stat--${ability} .ability-block__score`)
    .text();
  try {
    score = parseInt(scoreText);
  } catch (e) {}
  return score;
}

function getDelimitedStrings(element: Cash, tidbitName: string) {
  const label = element
    .find(".mon-stat-block__attribute-label, .mon-stat-block__tidbit-label")
    .filter((_, e: Element) => e.innerHTML.trim() == tidbitName)
    .first();

  const delimitedString = label
    .parent()
    .find(".mon-stat-block__attribute-data-value, .mon-stat-block__tidbit-data")
    .text()
    .replace("--", "")
    .trim();

  if (delimitedString.length > 0) {
    const commaPattern = /, ?/;
    const semicolonPattern = /; ?/;
    const splitPattern = delimitedString.includes(";")
      ? semicolonPattern
      : commaPattern;

    const bpsString = "Bludgeoning, Piercing, and Slashing";
    const bpsPlaceholder = "BPS_PLACEHOLDER";
    const stringWithPlaceholder = delimitedString.replace(
      bpsString,
      bpsPlaceholder
    );

    const itemsWithPlaceholder = stringWithPlaceholder
      .split(splitPattern)
      .map((s) => s.trim());
    return itemsWithPlaceholder.map((i) =>
      i.replace(bpsPlaceholder, bpsString)
    );
  }
  return [];
}

function getDelimitedModifiers(element: Cash, tidbitName: string) {
  const entries = getDelimitedStrings(element, tidbitName);
  return entries.map((e) => {
    // Extract the last piece of the name/modifier, and parse an int from only that, ensuring the name can contain any manner of spacing.
    const nameAndModifier = e.split(" ");
    const modifierValue = parseInt(nameAndModifier.pop() ?? "0");

    // Join the remaining string name, and trim outside spacing just in case.
    return {
      Name: nameAndModifier.join(" ").trim(),
      Modifier: modifierValue,
    };
  });
}

function getChallenge(element: Cash) {
  const challengeText = getDelimitedStrings(element, "Challenge");
  if (challengeText.length == 0) {
    return "0";
  }
  const matches = challengeText[0].match(/(\d|\/){1,4}/);
  return matches?.[0] || "0";
}

function getXp(element: Cash): number | undefined {
  // XP rides on the Challenge line. 2014 writes it "1,100 XP" ("Challenge 4
  // (1,100 XP)"), 2024 "XP 1,100" — handle both orders. Read the whole block so the
  // comma in "1,100" doesn't trip the comma/semicolon delimiter splitters.
  const m = element.text().match(/XP[\s:]*([\d,]+)|([\d,]+)\s*XP/i);
  const raw = m?.[1] ?? m?.[2];
  return raw ? parseInt(raw.replace(/,/g, ""), 10) : undefined;
}

function getPowers(element: Cash, type: string): NameAndContent[] {
  const section = getPowerSection(element, type);

  const powerEntries = section
    .find(".mon-stat-block__description-block-content p")
    .get()
    .map((el) => {
      const contentNode = cash(el).clone();
      const powerName = contentNode.find("strong").first().remove();
      return {
        Name: powerName.text().trim().replace(/\.$/, ""),
        Content: contentNode.text().trim(),
      };
    });

  return collapsePowerDescriptions(powerEntries);
}

function collapsePowerDescriptions(powerEntries: NameAndContent[]) {
  return powerEntries.reduce<NameAndContent[]>((p, c, i) => {
    const isFirstParagraph = i == 0 || c.Name.length > 0;
    let fullPowerText = c.Content;

    let lookAhead = i;
    if (isFirstParagraph) {
      while (
        powerEntries[++lookAhead] &&
        powerEntries[lookAhead].Name.length == 0
      ) {
        fullPowerText += "\n\n" + powerEntries[lookAhead].Content;
      }
      return p.concat({
        Name: c.Name,
        Content: fullPowerText,
      });
    }
    return p;
  }, []);
}

// A section is a description block identified by its own heading (Traits is the
// leading block, which may carry a "Traits" heading or none). Match on the block's
// heading and let getPowers pull descendant <p> at any depth: some DDB pages
// (partnered / homebrew) wrap a section's content in a second nested
// `description-block-content`. Selecting content divs by .parent() then missed the
// nested copy entirely (legendary actions vanished) and mis-filed it under the
// heading-less Traits scan.
function getPowerSection(element: Cash, type: string) {
  return element
    .find(".mon-stat-block__description-block")
    .filter((i, e) => {
      const heading = cash(e)
        .children(".mon-stat-block__description-block-heading")
        .first()
        .text()
        .trim();
      if (type == "Traits") return heading == "" || heading == "Traits";
      return heading == type;
    });
}
