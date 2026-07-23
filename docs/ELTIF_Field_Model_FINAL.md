# ELTIF Term Sheet Generator — Field Model (FINÁL pro předání IT)

**Jurisdikce:** český ELTIF ve formě **SICAV** (akciová společnost s proměnným základním kapitálem → vydává *investiční akcie*) nebo **otevřený podílový fond / OPF** (bez právní osobnosti → vydává *podílové listy*).

**Cílový trh:** fond je určen **výhradně retail investorům** (nařízení používá termín *neprofesionální investor*). Z toho plyne: strop pákování 50 % NAV a plné uplatnění koncentračních limitů a režimu likvidity podle pravidel ELTIF pro retail.

**Jazyk:** nástroj je **dvojjazyčný (CZ / EN)** — dvě jazykové verze formuláře i dvě verze generovaného PDF. Lokalizační řetězce (popisky + help texty) v obou jazycích viz **Příloha C**.

**Právní rámec:** přímo použitelné nařízení ELTIF (EU) 2015/760 ve znění (EU) 2023/606 („ELTIF 2.0", účinné od 10. 1. 2024) + RTS Komise (EU) 2024/2759 (redempce, LMT, matching; účinné od 26. 10. 2024). Forma fondu (SICAV/OPF, depozitář, obhospodařovatel/administrátor) se řídí zákonem č. 240/2013 Sb. (ZISIF). Pravidla ZISIF o odkupu a pozastavení nesmí být méně přísná, než dovolí ELTIF.

---

## Legenda sloupců

| Sloupec | Co obsahuje |
|---|---|
| **Pole** | technický klíč pole (pro backend / JetFormBuilder) |
| **Label (EN / CZ)** | popisek zobrazený uživateli |
| **Typ** | typ vstupu ve formuláři |
| **Hodnoty** | přípustné hodnoty / rozsah / validace |
| **Zobrazit když** | podmínka viditelnosti (větvení) |
| **Vazby / výpočty** | na co pole navazuje nebo co spouští |
| **Pov.** | povinné pole (Ano/Ne) |
| **Vysvětlení pro uživatele** | help text („more" / tooltip) psaný polopaticky pro laika — přímo použitelný ve formuláři |

---

## Větvení / rozhodovací logika (přehled)

1. **`legal_form`** je hlavní přepínač. `SICAV` → zobrazí volbu samosprávnosti a obhospodařovatele (investiční akcie). `OPF` → zobrazí obhospodařovatele (investiční společnost), vždy externí, vydává podílové listy.
2. **`target_investors`** (Retail / Professional) řídí strop pákování: retail max 50 % NAV, professional max 100 % NAV. Retail navíc zapíná plný režim LMT/redempcí a srozumitelný jazyk popisů.
3. **Třídy podílů** jsou dynamicky opakovatelná skupina (repeater): pro každou třídu zvlášť měna, min. úpis, poplatky; `distribution_frequency` se ukáže jen u distribučních tříd.
4. **`redemption_calibration_method`** (Annex I / Annex II) přepíná, která pole odkupu jsou aktivní a jak se počítá strop odkupu.

---

## Sekce 1 — Základní údaje o fondu

| Pole | Label (EN / CZ) | Typ | Hodnoty | Zobrazit když | Vazby / výpočty | Pov. | Vysvětlení pro uživatele |
|---|---|---|---|---|---|---|---|
| `name_of_eltif` | Name of ELTIF / Název ELTIF | text | — | vždy | — | Ano | Oficiální název fondu, pod kterým bude nabízen investorům. |
| `legal_form` | Legal Form / Právní forma | dropdown | SICAV (investiční akcie); Otevřený podílový fond (podílové listy) | vždy | Hlavní větvení celého formuláře | Ano | Právní „obal" fondu. SICAV je akciová společnost s proměnným kapitálem a vydává investiční akcie. Otevřený podílový fond nemá vlastní právní osobnost — spravuje ho investiční společnost a vydává podílové listy. Volba mění, kdo fond spravuje a jaké cenné papíry investor drží. |
| `self_managed` | Self-Managed / Samosprávný fond | radio | Ano / Ne | `legal_form` = SICAV | Ne → zobrazí `name_of_aifm` | Ano (SICAV) | Určuje, zda si SICAV spravuje majetek sám (má vlastní licenci), nebo správu svěřuje externí společnosti. U podílového fondu tato volba nedává smysl a nezobrazuje se. |
| `name_of_aifm` | AIFM / Obhospodařovatel | text | — | `legal_form` = SICAV a `self_managed` = Ne | — | Ano | Společnost s licencí, která fond reálně řídí — rozhoduje o investicích a hlídá pravidla (u SICAV se spravuje sám nebo přes tuto firmu). |
| `name_of_management_company` | Management Company / Obhospodařovatel (investiční společnost) | text | — | `legal_form` = OPF | — | Ano | Investiční společnost, která podílový fond vytvořila a spravuje. Podílový fond sám o sobě není firma, takže ho vždy řídí tato společnost. |
| `name_of_investment_manager` | Investment Manager / Investiční manažer | text | — | vždy | — | Ne | Kdo fakticky vybírá konkrétní investice, pokud je tato role svěřena (delegována) dál. Nepovinné. |
| `name_of_administrator` | Administrator / Administrátor | text | — | vždy | — | Ne | Firma, která fondu zajišťuje „provozní zázemí" — účetnictví, výpočet hodnoty, reporting. |
| `name_of_depositary` | Depositary / Depozitář | text | — | vždy | — | Ano | Banka nebo obchodník, který opatruje majetek fondu a dohlíží na jeho pohyby. Ze zákona ho musí mít každý fond. |
| `fund_reference_currency` | Reference Currency / Referenční měna fondu | dropdown | CZK; EUR; USD | vždy | Měna, v níž se počítá NAV a kalibrace odkupu (fund‑level) | Ano | Základní měna, ve které fond vede svou celkovou hodnotu. Podíly v jiných měnách se do ní přepočítávají. |

---

## Sekce 2 — Doba trvání

| Pole | Label (EN / CZ) | Typ | Hodnoty | Zobrazit když | Vazby / výpočty | Pov. | Vysvětlení pro uživatele |
|---|---|---|---|---|---|---|---|
| `duration` | Duration ('end of life') / Doba trvání | radio | Undetermined (na dobu neurčitou); Limited to (omezená na) | vždy | Limited → zobrazí `duration_limited_to` | Ano | Jak dlouho fond funguje. Buď bez pevného konce, nebo do předem dané doby, po které se fond ukončí a majetek rozprodá. |
| `duration_limited_to` | Duration — Limited To / Omezená na (roky) | number | roky | `duration` = Limited to | — | Ano (podm.) | Počet let, po kterých fond skončí. |

---

## Sekce 3 — Investiční strategie a investiční limity

> Pozn. k limitům: ELTIF vyžaduje min. **55 % kapitálu** ve způsobilých investičních aktivech (čl. 13 odst. 1), proto max 45 % do UCITS-způsobilých. Koncentrační limity 20 % a 10 % kapitálu jsou pro retail fond zákonné (čl. 13 odst. 2). Skladba se měří vůči **kapitálu** fondu, ne vůči NAV (viz Sekce 10).

| Pole | Label (EN / CZ) | Typ | Hodnoty | Zobrazit když | Vazby / výpočty | Pov. | Vysvětlení pro uživatele |
|---|---|---|---|---|---|---|---|
| `strategy_ioas` | Investment Objective and Strategy / Investiční cíl a strategie | text (long) | — | vždy | — | Ne | Slovní popis, do čeho a proč fond investuje a čeho chce dosáhnout. |
| `strategy_tatuea` | Target Allocation to UCITS Eligible Assets / Cílová alokace do UCITS-způsobilých aktiv | number | 1–45 % | vždy | Zbytek do min. 55 % dlouhodobých aktiv | Ne | Kolik procent fond nejvýš drží v běžných, snadno prodejných cenných papírech (akcie, dluhopisy). Zbytek jde do dlouhodobých investic — to je podstata ELTIF. **Upozornění:** 45 % je strop plynoucí z požadavku ELTIF držet aspoň 55 % v dlouhodobých způsobilých aktivech; nelze jít výš. |
| `strategy_ilseeia` | Investment Limitation in a Single ELTIF Eligible Asset / Limit na jedno dlouhodobé aktivum | number | 1–20 % | vždy | Validace: max 20 % | Ne | Nejvýše kolik procent fondu smí být v jediné dlouhodobé investici — brání přílišné závislosti na jednom projektu. **Upozornění:** protože je fond určen retail investorům, je 20 % zákonným stropem podle diverzifikačních pravidel ELTIF (čl. 13). Vyšší hodnotu nelze nastavit. |
| `strategy_ilsuea` | Investment Limitation in a Single UCITS Eligible Asset / Limit na aktiva podle čl. 9 odst. 1 písm. b) (UCITS-způsobilá) vydaná jedním subjektem | number | 1–10 % | vždy | Validace: max 10 % | Ne | Nejvýše kolik procent fondu smí být v jediném běžném cenném papíru. **Upozornění:** u fondu pro retail investory je 10 % zákonným stropem (čl. 13 ELTIF); nelze jít výš. |
| `strategy_apac` | Additional Portfolio Allocation Considerations / Další možnosti k alokaci | text | — | vždy | — | Ne | Prostor pro doplňující pravidla k rozložení portfolia. |
| `strategy_ramp_up_period` | Ramp-Up Period / Startovací období (ramp-up period) | dropdown | Less than a year; 1; 2; 3; 4; 5 (roky) | vždy | — | Ne | Jak dlouho po startu trvá, než fond naplno rozinvestuje vložené peníze. |
| `sfdr_category` | SFDR Article / Ustanovení SFDR | radio | 6; 8; 9 | vždy | — | Ne | Míra „udržitelnosti" fondu podle EU pravidel: článek 6 = bez zvláštního důrazu, článek 8 = zohledňuje ekologická/sociální hlediska, článek 9 = přímo cílí na udržitelný dopad. |

---

## Sekce 4 — Cíloví investoři a pákování

| Pole | Label (EN / CZ) | Typ | Hodnoty | Zobrazit když | Vazby / výpočty | Pov. | Vysvětlení pro uživatele |
|---|---|---|---|---|---|---|---|
| `target_investors` | Target Investors / Cíloví investoři | radio (locked) | Retail | vždy | Fixně Retail → `leverage_borrowing_amount` max 50 % | Ano | Komu je fond určen. Tento fond je určen výhradně retail investorům, kteří mají přísnější ochranu a nižší povolené zadlužení fondu. Hodnota je pevně nastavena. |
| `leverage_borrowing_amount` | Borrowing — Amount / Zápůjčky a úvěry – objem | number | 1–50 % | vždy | Strop 50 % (retail) | Ano | Kolik si fond smí půjčit navíc k penězům investorů, vyjádřeno v % hodnoty fondu. Půjčka může zvýšit výnos i ztrátu. **Upozornění:** u fondu pro retail investory je zákonný strop 50 % NAV. |
| `leverage_borrowing_maturity` | Borrowing — Maturity / Splatnost zápůjček a úvěrů | text | — | vždy | — | Ano | Na jak dlouho si fond peníze půjčuje. |
| `leverage_aifmd_commitment_method` | AIFMD Leverage — Commitment Method / Páka — závazková metoda | text | — | vždy | — | Ano | Míra zadlužení spočítaná jednou z úředně předepsaných metod (započítává i deriváty). Slouží k porovnání rizika mezi fondy. |
| `leverage_aifmd_gross_method` | AIFMD Leverage — Gross Method / Páka — hrubá metoda | text | — | vždy | — | Ano | Druhá úředně předepsaná metoda výpočtu zadlužení, tentokrát „hrubě", bez započtení protipozic. |

---

## Sekce 5 — Třídy podílů (dynamicky opakovatelná skupina)

> Repeater: uživatel může přidat *N* tříd (`x`). Každá třída má vlastní měnu a poplatky. `distribution_frequency` se zobrazí jen u tříd typu Distribution.

| Pole | Label (EN / CZ) | Typ | Hodnoty | Zobrazit když | Vazby / výpočty | Pov. | Vysvětlení pro uživatele |
|---|---|---|---|---|---|---|---|
| `share_class_x` | Share Class / Třída podílů | radio | Accumulation (růstová); Distribution (výplatní) | vždy (v každé třídě) | Distribution → `distribution_frequency_x` | Ano | Varianta téhož fondu. Růstová (accumulation) výnosy nechává ve fondu a reinvestuje; výplatní (distribution) je pravidelně vyplácí investorovi. |
| `currency_x` | Currency / Měna | radio | CZK; EUR; USD | vždy (v každé třídě) | — | Ano | V jaké měně je daná třída vedena. |
| `minimum_subscription_amount_x` | Minimum Subscription Amount / Minimální úpis | number | částka | vždy (v každé třídě) | — | Ano | Nejnižší částka, kterou lze do této třídy jednorázově vložit. |
| `management_fee_x` | Management Fee / Poplatek za obhospodařování | number | % | vždy (v každé třídě) | — | Ano | Roční poplatek za správu fondu, v % z investice. |
| `performance_fee_x` | Performance Fee / Výkonnostní poplatek | text | šablona „XX %, subject to XX % hurdle & high water mark…" | vždy (v každé třídě) | — | Ne | Odměna správce z nadstandardního zisku. „Hurdle" = minimální výnos, který musí fond překonat; „high water mark" = poplatek se platí jen z nového maxima, ne opakovaně z téhož zisku. |
| `distribution_frequency_x` | Distribution Frequency / Frekvence výplat | radio | Monthly (měsíčně); Quarterly (čtvrtletně) | `share_class_x` = Distribution | — | Ano (podm.) | Jak často výplatní třída posílá výnos investorovi. Vyplňte jen u výplatních tříd. |

---

## Sekce 6 — Vstupní a výstupní poplatky

| Pole | Label (EN / CZ) | Typ | Hodnoty | Zobrazit když | Vazby / výpočty | Pov. | Vysvětlení pro uživatele |
|---|---|---|---|---|---|---|---|
| `subscription_fee` | Subscription Fee / Vstupní poplatek | number | 0–5 % | vždy | — | Ano | Jednorázový poplatek při nákupu podílů, v % z vkladu. |
| `redemption_fee` | Redemption Fee / Výstupní poplatek | number | 0–11 % | vždy | Součást `anti_dilution_lmt` | Ano | Poplatek při vystoupení z fondu. Kromě příjmu chrání zůstávající investory před náklady, které vyvolá odchod jiných (tzv. anti-dilution). |
| `anti_dilution_lmt` | Anti-Dilution LMT / Nástroje proti ředění (anti-dilution tools) | checkbox (multi) | Anti-dilution levy; Swing pricing; Redemption fee | vždy | `redemption_fee` je jedním z nich | Ne (doporučeno ≥ 1) | Nástroje, které zajistí, aby náklady spojené s odchodem některých investorů nesli ti odcházející, ne ti, kdo ve fondu zůstávají. Zákon je nevyžaduje, ale doporučuje aspoň jeden. |

---

## Sekce 7 — Úpisy (nákupy)

| Pole | Label (EN / CZ) | Typ | Hodnoty | Zobrazit když | Vazby / výpočty | Pov. | Vysvětlení pro uživatele |
|---|---|---|---|---|---|---|---|
| `subscription_frequency` | Subscription Frequency / Frekvence úpisů | text | „[first calendar day of each month]" | vždy | — | Ano | Kdy lze do fondu vstupovat (např. vždy 1. den v měsíci). |
| `subscription_cut_off_time` | Subscription Cut-Off Time / Uzávěrka úpisů | number | 1–29 dní před | vždy | — | Ano | Kolik dní před dnem úpisu musí být žádost o vstup doručena. |
| `subscription_payment_date` | Subscription Payment Date / Datum platby úpisu | number | 1–10 dní před | vždy | — | Ano | Kolik dní před dnem úpisu musí investor poslat peníze. |
| `nav_calculation_date` | NAV Calculation Date / Datum výpočtu NAV | text | „[end of the immediately preceding month]" | vždy | Vstup do ceny úpisu i odkupu | Ano | Ke kterému dni se stanoví hodnota podílu (NAV), za kterou se nakupuje a prodává. |

---

## Sekce 8 — Odkupy (Redemptions) + simulace

> Strop odkupu podle RTS 2024/2759: max % se aplikuje na **základnu = likvidní aktiva (čl. 9(1)(b)) + prudentní 12měsíční cash flow** (čl. 5(6)), nikoli na celé NAV.
>
> **Úroveň výpočtu:** RTS kalibruje na úrovni **celého ELTIF**, ne jednotlivé třídy. Základna, `max_redemption_pct`, kapacita i pro‑rata se počítají **fund‑level v `fund_reference_currency`**; žádosti tříd v jiných měnách se přepočtou FX k datu ocenění a investor je vyplacen ve své třídní měně. Při převisu poptávky se krátí poměrně napříč všemi třídami (fair treatment, čl. 18).

| Pole | Label (EN / CZ) | Typ | Hodnoty | Zobrazit když | Vazby / výpočty | Pov. | Vysvětlení pro uživatele |
|---|---|---|---|---|---|---|---|
| `redemption_calibration_method` | Redemption Calibration Method / Metoda výpočtu odkupu | dropdown | Annex I; Annex II | vždy | Přepíná pole odkupu a výpočet stropu | Ano | Zákon nabízí dvě cesty, jak spočítat, kolik peněz smí fond vyplatit odcházejícím investorům v jeden výplatní den. **Annex I:** strop odvodí z toho, jak často se dá o odkup žádat a jak dlouho předem to musí investor ohlásit — čím delší ohlášení, tím větší část lze vyplatit. **Annex II:** místo toho fond drží stálý polštář snadno prodejných aktiv a podle jeho velikosti se strop určí. Vyberte jednu cestu. |
| `redemption_frequency` | Redemption Frequency / Frekvence odkupů | dropdown | Weekly; Bi-weekly; Monthly; 2 months; Quarterly; 6 months; 12 months | vždy | Vstup do tabulky stropu; > čtvrtletně → nutné zdůvodnit dohledu | Ano | Jak často během roku může investor požádat o vrácení peněz. Častější odkupy = přísnější podmínky, protože fond drží dlouhodobé investice, které nejdou rychle prodat. |
| `redemption_notice_period` | Redemption Notice Period / Výpovědní lhůta | dropdown | None; 2 weeks; 1; 3; 6; 9; 12 months | `redemption_calibration_method` = Annex I | Sloupec tabulky Annex I; < 3 měsíce → nutná notifikace dohledu | Ano (Annex I) | Kolik času předem musí investor oznámit, že chce peníze zpět, než mu je fond vyplatí. Delší lhůta dává fondu čas prodat majetek, a proto umožňuje vyplatit větší část najednou. |
| `min_liquid_assets_pct` | Minimum Liquid Assets / Minimální procento aktiv podle čl. 9 odst. 1 písm. b) (likvidní aktiva) | number (auto) | 10 / 15 / 20 / 25 % | `redemption_calibration_method` = Annex II | Odvozeno z `redemption_frequency`; musí platit ke každému výplatnímu dni | Ano (Annex II) | Kolik procent fondu musí být trvale v hotovosti a snadno prodejných aktivech, aby bylo z čeho vyplácet. Čím častější odkupy, tím větší polštář zákon vyžaduje. |
| `max_redemption_pct` | Maximum Redemption % / Maximální % odkupu | number (read-only) | 0–100 % | vždy | Výstup tabulky Annex I/II | Auto | Nejvyšší podíl dostupných peněz fondu, který lze vyplatit v jeden výplatní den. Počítá se automaticky z vaší volby metody, frekvence a lhůty. |
| `liquid_assets_amount` | Liquid Assets (Art 9(1)(b)) / Likvidní aktiva | number | EUR | vždy | Složka základny odkupu | Ano | Hodnota snadno prodejného majetku fondu (hotovost, běžné cenné papíry), z něhož se dají hradit výplaty. |
| `expected_cashflow_12m` | Expected 12m Cash Flow / Očekávané roční cash flow | number | EUR | vždy | Složka základny odkupu; jen jisté kladné toky, bez nových úpisů | Ano | Peníze, které fondu s vysokou jistotou přijdou během příštího roku (např. splátky, výnosy). Nepočítají se sem peníze od nových investorů. |
| `redemption_cut_off` | Redemption Cut-Off Time / Uzávěrka odkupů | number | 1–29 dní před | vždy | Časová osa výplaty | Ano | Kolik dní před výplatním dnem musí být žádost o odkup doručena. |
| `redemption_dealing_date` | Redemption Date / Výplatní den | text | „[first calendar day of each month]" | vždy | Kotva časové osy | Ano | Den, ke kterému se odkupy vyřizují. |
| `payment_of_redemption_proceeds` | Payment of Redemption Proceeds / Výplata odkupu | number | dní po výplatním dni | vždy | Časová osa | Ano | Za kolik dní po výplatním dni dostane investor peníze na účet. |
| `carry_policy` | Treatment of Unexecuted Requests / Nakládání s nevyřízenou částí | dropdown | Automatic carry-over; New request; Investor choice | vždy | Řídí rozvrh při zkrácení | Ano | Když v jeden den požádá o odkup víc lidí, než kolik smí fond vyplatit, žádosti se poměrně zkrátí. Tady určíte, co se stane se zbytkem: buď se **automaticky přesune** na další výplatní den ve frontě, nebo **propadne a investor musí požádat znovu**, nebo si volbu nechá na investorovi. |
| `min_holding_period` | Minimum Holding Period / Minimální doba držení | number + podmínky | měsíce | vždy | — | Ne | Nejkratší doba, po kterou investor musí podíly držet, než může poprvé požádat o odkup. |
| `redemption_in_kind` | Repayment in Kind / Výplata v nepeněžitém plnění | radio | Yes / No | vždy | — | Ne | Zda fond může místo peněz vyplatit odcházejícího investora přímo částí svého majetku. |
| `redemptions_simulation` | Redemptions Simulation / Simulace odkupů | výpočetní modul | — | vždy | Vstupy: metoda, frekvence, lhůta, základna, carry policy, žádost investora | Ano | Interaktivní ukázka: podle nastavení fondu spočítá, kdy a kolik peněz by odcházející investor reálně dostal — včetně situace, kdy chce vystoupit víc lidí najednou. |

---

## Sekce 9 — Kontakt a souhlas (GDPR)

| Pole | Label (EN / CZ) | Typ | Hodnoty | Zobrazit když | Vazby / výpočty | Pov. | Vysvětlení pro uživatele |
|---|---|---|---|---|---|---|---|
| `title` | Title / Oslovení | radio | Ms; Mr (EN) / Vážená paní; Vážený pane (CZ) | vždy | — | Ano | Oslovení kontaktní osoby. |
| `last_name` | Last Name / Příjmení | text | — | vždy | — | Ne | Příjmení kontaktní osoby. |
| `first_name` | First Name / Jméno | text | — | vždy | — | Ne | Jméno kontaktní osoby. |
| `email` | Email / E-mail | email | validní e-mail | vždy | Odeslání PDF | Ano | E-mail, na který přijde vygenerovaný term sheet. |
| `company` | Company / Společnost | text | — | vždy | — | Ne | Název vaší společnosti. |
| `agreement` | Consent / Souhlas | checkbox | „Beru na vědomí, že Finreg zpracuje mé osobní údaje za účelem vyřízení mého požadavku" | vždy | — | Ano | Souhlas se zpracováním údajů — nutný, aby vám mohl být term sheet zaslán. |

---

## Sekce 10 — Portfolio a výpočtová vrstva (bod 3)

> Regulační základ: skladba portfolia se dle ELTIF měří vůči **kapitálu** fondu (čl. 13), zápůjčky vůči **čisté hodnotě aktiv / NAV** (čl. 16). Kategorie aktiv = způsobilá investiční aktiva dle čl. 10 + likvidní aktiva dle čl. 9 odst. 1 písm. b).

| Pole | Label (EN / CZ) | Typ | Hodnoty | Zobrazit když | Vazby / výpočty | Pov. | Vysvětlení pro uživatele |
|---|---|---|---|---|---|---|---|
| `asset_class_x` | Asset Class / Kategorie aktiv | dropdown (repeater) | Kapitálové/kvazikapitálové nástroje; Dluhové nástroje; Úvěry; Podíly v jiných fondech; Reálná aktiva; STS sekuritizace; Zelené dluhopisy; Likvidní aktiva (čl. 9(1)(b)) | vždy (repeater) | Vstup do `total_assets` a alokace | Ano | Do jaké kategorie investice patří. Prvních sedm jsou dlouhodobá „způsobilá" aktiva ELTIF; poslední je likvidní rezerva. |
| `asset_class_amount_x` | Asset Class Amount / Hodnota kategorie | number | částka v `fund_reference_currency` | vždy (repeater) | Σ → `total_assets` | Ano | Kolik je do dané kategorie investováno. |
| `eltif_capital` | ELTIF Capital / Kapitál fondu | number | částka | vždy | Základ pro 55/45 a diverzifikaci (čl. 13) | Ano | Investovatelný kapitál fondu (vklady + nesplacené přísliby po odečtení poplatků) — regulační základ, k němuž se poměřují investiční limity. |
| `nav` | Net Asset Value / Čistá hodnota aktiv | number | částka | vždy | Základ pro zápůjčky (čl. 16) a odkupovou simulaci | Ano | Čistá hodnota fondu po odečtení závazků. |
| `total_assets` | Total Investment / Celkem investováno | number (auto) | Σ `asset_class_amount_x` | vždy | součet kategorií | Auto | Celkový objem investic (součet kategorií). |
| `total_eligible_pct` | Eligible Assets % / Podíl způsobilých aktiv | number (auto, read-only) | % | vždy | Σ(způsobilé) ÷ `eltif_capital`; kontrola ≥ 55 % | Auto | Podíl dlouhodobých způsobilých aktiv na kapitálu; ze zákona min. 55 %. |
| `avg_liquidity` | Average Liquidity / Průměrná likvidita | number (auto, read-only) | % p.a. (+ oken/rok) | vždy | `min(100, max_redemption_pct × odkupů/rok)` | Auto | Orientační roční likvidita: kolik z dostupné části fondu lze za rok odkoupit, plus počet odkupových oken ročně. Odvozeno z frekvence a stropu odkupu — bez dalších vstupních polí. |

Výpočty (backend):

- `total_assets = Σ asset_class_amount_x`
- `total_eligible_pct = Σ(amount kde kategorie ≠ Likvidní) ÷ eltif_capital` → validace ≥ 55 %
- `liquid_pct = amount(Likvidní) ÷ eltif_capital` (pro kontrolu min. polštáře u Annex II)
- `redemptions_per_year` = z `redemption_frequency` (12 / 6 / 4 / 2 / 1 …)
- `avg_liquidity_pct = min(100, max_redemption_pct × redemptions_per_year)`; `avg_liquidity_windows = redemptions_per_year`

---

## Rozhodnutá řešení (zapracováno)

1. **Cílový trh = retail‑only.** Odstraněna volba Professional; páka fixně max 50 % NAV; koncentrační limity (20 % / 10 %) uplatí jako zákonný strop s upozorněním v help textu.
2. **`redemption_fee` strop 11 %** ponechán jako záměrná byznys volba (nejde o zákonný limit).
3. **Annex II, frekvence „Á 2 měsíce"** není v tabulce RTS → backend použije lineární aproximaci dle recitálu 9 RTS (viz Příloha A).
4. **Suspenze odkupů** (ZISIF) není pole term sheetu; řeší se jako samostatný scénář v simulátoru odkupů.
5. **Jazyk = CZ + EN.** Dvě verze formuláře i PDF; bilingvní řetězce v Příloze C.
6. **Úroveň kalibrace odkupu = fund‑level** v `fund_reference_currency` (RTS čl. 5(6) pracuje s ELTIF, ne třídou); třídní částky přepočíst FX.
7. **Oslovení** = Ms / Mr (EN), Vážená paní / Vážený pane (CZ).
8. **Autorita simulace = RTS 2024/2759** (Příloha A + B). Závazná specifikace pro IT; samostatná verifikace ze strany FINREG se nevyžaduje.
9. **Asset classes = kategorie dle čl. 10** nařízení + likvidní aktiva (čl. 9(1)(b)), dynamicky (repeater). Viz Sekce 10.
10. **Základ výpočtů:** skladba/diverzifikace vůči **kapitálu** (čl. 13), zápůjčky vůči **NAV** (čl. 16). `total_assets` rozdělen na `eltif_capital` a `nav`.
11. **Average Liquidity** bez nových polí — odvozena jako `min(100 %, max_redemption_pct × počet odkupů/rok)`.

---

## Příloha A — Kalibrace stropu odkupu (RTS 2024/2759) pro backend

**Základna odkupu (čl. 5(6)):** `redemption_base = liquid_assets_amount + expected_cashflow_12m`
**Max částka k odkupu v daném výplatním dni:** `max_redemption_amount = max_redemption_pct × redemption_base`

`max_redemption_pct` se vezme z Annexu podle `redemption_calibration_method`:

### Annex I — Option 1 (baseline): řádek = frekvence, sloupec = notice period

| Frekvence ↓ / Notice → | None | 2 týd | 1 měs | 3 měs | 6 měs | 9 měs | 12 měs |
|---|---|---|---|---|---|---|---|
| 12 měsíců | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| 6 měsíců | 50,0 | 52,2 | 54,5 | 66,7 | 100 | 100 | 100 |
| 3 měsíce | 25,0 | 26,1 | 27,3 | 33,3 | 50,0 | 100 | 100 |
| 2 měsíce | 16,7 | 17,4 | 18,2 | 22,2 | 33,3 | 66,7 | 100 |
| 1 měsíc | 8,3 | 8,7 | 9,1 | 11,1 | 16,7 | 33,3 | 100 |
| 14 dní | 4,2 | 4,3 | 4,5 | 5,6 | 8,3 | 16,7 | 100 |
| Týdně | 1,9 | 2,0 | 2,1 | 2,6 | 3,8 | 7,7 | 100 |

Hodnoty jsou v %. Pro kombinace mimo tabulku použij lineární aproximaci (RTS, recitál 9). Options 2 a 3 (agregace sub‑měsíčních/dvouměsíčních frekvencí) v této verzi nepoužíváme.

### Annex II: frekvence → min. likvidní polštář + max %

| Frekvence | Min. likvidní aktiva (čl. 9(1)(b)) | Max % |
|---|---|---|
| 12 měsíců a řidší | 10 % | 100 % |
| 6 měsíců | 15 % | 67 % |
| 3 měsíce | 20 % | 50 % |
| 1 měsíc a častěji | 25 % | 20 % (měsíční agregát) |
| 2 měsíce (mimo tabulku) | ~22,5 % (interpolace) | ~35 % (interpolace) |

Zákonné pojistky (validace + hlášky ve formuláři):
- `redemption_notice_period` < 3 měsíce → informovat NCA a zdůvodnit (čl. 5(8)).
- `redemption_frequency` častěji než čtvrtletně → zdůvodnit NCA (čl. 5(4)).
- Annex II: min. likvidní polštář musí platit ke každému výplatnímu dni; při poklesu ho manažer v přiměřené době obnoví, aniž znemožní odkupy (čl. 5(7)).

---

## Příloha B — Algoritmus simulace odkupů

Vstupy: `redemption_calibration_method`, `redemption_frequency`, `redemption_notice_period`, `liquid_assets_amount`, `expected_cashflow_12m`, `redemption_cut_off`, `payment_of_redemption_proceeds`, `redemption_fee`, `carry_policy`, žádost investora (`request_date`, `amount`), agregátní poptávka.

1. **Strop:** `pct` z Přílohy A; `base = liquid_assets_amount + expected_cashflow_12m`; `capacity = pct × base`.
2. **Výplatní den:** žádost musí dorazit o `max(notice_days, redemption_cut_off)` dní dříve; první možný výplatní den = nejbližší den v harmonogramu (dle frekvence) splňující tuto podmínku.
3. **Pro‑rata při převisu:** je‑li agregátní poptávka > `capacity`, faktor `s = capacity ÷ poptávka`; investor dostane `s × pending`.
4. **Nakládání se zbytkem (`carry_policy`):** *Automatic carry-over* → zbytek na další výplatní den, opakuj krok 3; *New request* → zbytek zaniká, investor podá novou žádost.
5. **Poplatek:** `net = accepted × (1 − redemption_fee)`.
6. **Výplata:** `payment_date = výplatní den + payment_of_redemption_proceeds`.

Výstupy: rozvrh (výplatní dny, částky, pro‑rata, zbytek, výplaty), počet dní do plného odkupu, čistý výnos.

*Volitelně (scénář, ne pole):* suspenze odkupů — od data X po dobu Y zastaví výplatní dny a posune časovou osu.

---

## Závislosti a poznámky pro IT

- **Výpočtová vrstva** (Average Liquidity, Total investment, kategorie aktiv) je zapracována v **Sekci 10**; regulační základ v **Příloze D**.
- **Dvojjazyčnost:** IT připraví dvě jazykové verze formuláře i PDF (CZ/EN); zdrojové řetězce v Příloze C.
- **PDF šablona** a přesné znění generovaných vět dodá FINREG v obou jazycích (např. „The fund will be structured as a Czech SICAV managed by…" / „Fond bude strukturován jako český SICAV spravovaný…").
- **Repeater tříd podílů** (Sekce 5): per‑class podmíněné zobrazení `distribution_frequency_x` je nejsložitější FE prvek — ověřit podporu v JetFormBuilder, případně řešit vlastní JS.
- Pole s příznakem **Auto / read-only** (`max_redemption_pct`) se nezadávají, ale počítají na backendu dle Přílohy A.

---

## Příloha C — Lokalizační řetězce EN (i18n)

CZ help texty = sloupec „Vysvětlení pro uživatele" v sekcích výše. Níže EN protějšky (label + help), ať má IT anglickou mutaci na jednom místě.

| Pole | CZ label | EN label | EN help text |
|---|---|---|---|
| `name_of_eltif` | Název ELTIF | Name of ELTIF | The official name of the fund under which it will be offered to investors. |
| `legal_form` | Právní forma | Legal Form | The legal "wrapper" of the fund. A SICAV is a variable-capital company issuing investment shares; an open-ended mutual fund has no legal personality — it is run by a management company and issues units. The choice affects who manages the fund and what securities you hold. |
| `self_managed` | Samosprávný fond | Self-Managed | Whether the SICAV manages its own assets (holds its own licence) or delegates management to an external company. Not applicable to a mutual fund. |
| `name_of_aifm` | Obhospodařovatel | AIFM | The licensed company that actually runs the fund — decides on investments and ensures the rules are followed. |
| `name_of_management_company` | Obhospodařovatel (inv. společnost) | Management Company | The management company that created and runs the mutual fund. A mutual fund is not a company itself, so it is always run by this company. |
| `name_of_investment_manager` | Investiční manažer | Investment Manager | Who actually selects the specific investments, where this role is delegated. Optional. |
| `name_of_administrator` | Administrátor | Administrator | The company providing the fund's operational back office — accounting, valuation, reporting. |
| `name_of_depositary` | Depozitář | Depositary | The bank or broker that safekeeps the fund's assets and oversees their movements. Required by law for every fund. |
| `fund_reference_currency` | Referenční měna fondu | Reference Currency | The base currency in which the fund's total value is calculated. Holdings in other currencies are converted into it. |
| `duration` | Doba trvání | Duration | How long the fund operates — either with no fixed end, or until a set date after which the fund is wound up and its assets sold. |
| `duration_limited_to` | Omezená na (roky) | Duration — Limited To | The number of years after which the fund ends. |
| `strategy_ioas` | Investiční cíl a strategie | Investment Objective and Strategy | A description of what the fund invests in, why, and what it aims to achieve. |
| `strategy_tatuea` | Cílová alokace do UCITS-způsobilých aktiv | Target Allocation to UCITS Eligible Assets | The maximum share held in ordinary, easily sellable securities (shares, bonds); the rest goes into long-term investments — the essence of an ELTIF. Note: 45% is a ceiling arising from the ELTIF requirement to hold at least 55% in long-term eligible assets and cannot be set higher. |
| `strategy_ilseeia` | Limit na jedno dlouhodobé aktivum | Investment Limitation in a Single ELTIF Eligible Asset | The maximum share of the fund in a single long-term investment — prevents over-reliance on one project. Note: because the fund is retail, 20% is a legal cap under ELTIF diversification rules (Art. 13) and cannot be set higher. |
| `strategy_ilsuea` | Limit na aktiva podle čl. 9 odst. 1 písm. b) (UCITS-způsobilá) vydaná jedním subjektem | Investment Limitation in a Single UCITS Eligible Asset | The maximum share of the fund in a single ordinary security. Note: for a retail fund, 10% is a legal cap (Art. 13 ELTIF). |
| `strategy_apac` | Další možnosti k alokaci | Additional Portfolio Allocation Considerations | Space for additional rules on portfolio allocation. |
| `strategy_ramp_up_period` | Startovací období (ramp-up period) | Ramp-Up Period | How long after launch it takes for the fund to fully invest the money it has raised. |
| `sfdr_category` | Ustanovení SFDR | SFDR Article | The fund's sustainability level under EU rules: Article 6 = no specific focus, Article 8 = considers environmental/social factors, Article 9 = directly targets sustainable impact. |
| `target_investors` | Cíloví investoři | Target Investors | Who the fund is for. This fund is aimed solely at retail investors, who receive stronger protection and a lower permitted level of fund borrowing. The value is fixed. |
| `leverage_borrowing_amount` | Zápůjčky a úvěry – objem | Borrowing — Amount | How much the fund may borrow on top of investors' money, as a % of fund value. Borrowing can increase both return and loss. Note: for a retail fund the legal cap is 50% of NAV. |
| `leverage_borrowing_maturity` | Splatnost zápůjček a úvěrů | Borrowing — Maturity | For how long the fund borrows. |
| `leverage_aifmd_commitment_method` | Páka — závazková metoda | AIFMD Leverage — Commitment Method | The fund's leverage measured by one of the officially prescribed methods (includes derivatives). Used to compare risk across funds. |
| `leverage_aifmd_gross_method` | Páka — hrubá metoda | AIFMD Leverage — Gross Method | The second officially prescribed leverage calculation, "gross", without netting offsetting positions. |
| `share_class_x` | Třída podílů | Share Class | A variant of the same fund. An accumulation class keeps and reinvests returns; a distribution class pays them out to you regularly. |
| `currency_x` | Měna | Currency | The currency in which this class is denominated. |
| `minimum_subscription_amount_x` | Minimální úpis | Minimum Subscription Amount | The lowest amount that can be invested into this class at once. |
| `management_fee_x` | Poplatek za obhospodařování | Management Fee | The annual fund management fee, as a % of the investment. |
| `performance_fee_x` | Výkonnostní poplatek | Performance Fee | The manager's reward from above-benchmark profit. "Hurdle" = the minimum return the fund must beat; "high water mark" = the fee is charged only on new highs, not repeatedly on the same profit. |
| `distribution_frequency_x` | Frekvence výplat | Distribution Frequency | How often a distribution class pays returns to you. Complete only for distribution classes. |
| `subscription_fee` | Vstupní poplatek | Subscription Fee | A one-off fee when buying units, as a % of the amount invested. |
| `redemption_fee` | Výstupní poplatek | Redemption Fee | A fee when leaving the fund. Besides income, it protects remaining investors from the costs triggered by others exiting (anti-dilution). |
| `anti_dilution_lmt` | Nástroje proti ředění (anti-dilution tools) | Anti-Dilution LMT | Tools ensuring the costs of some investors leaving are borne by those leaving, not those staying. The law does not require them but recommends at least one. |
| `subscription_frequency` | Frekvence úpisů | Subscription Frequency | When investors can enter the fund (e.g. the first day of each month). |
| `subscription_cut_off_time` | Uzávěrka úpisů | Subscription Cut-Off Time | How many days before the subscription date a request to enter must be received. |
| `subscription_payment_date` | Datum platby úpisu | Subscription Payment Date | How many days before the subscription date the investor must send the money. |
| `nav_calculation_date` | Datum výpočtu NAV | NAV Calculation Date | The date on which the value of a unit (NAV) is set, at which units are bought and sold. |
| `redemption_calibration_method` | Metoda výpočtu odkupu | Redemption Calibration Method | The law offers two ways to calculate how much the fund may pay out to exiting investors on a single payout day. Annex I derives the cap from how often redemptions can be requested and how far in advance you must give notice — longer notice allows a larger share to be paid. Annex II instead requires the fund to hold a permanent buffer of easily sellable assets and sets the cap from its size. Choose one. |
| `redemption_frequency` | Frekvence odkupů | Redemption Frequency | How often during the year you can request your money back. More frequent redemptions mean stricter conditions, because the fund holds long-term investments that cannot be sold quickly. |
| `redemption_notice_period` | Výpovědní lhůta | Redemption Notice Period | How far in advance you must announce you want your money back before the fund pays out. Longer notice gives the fund time to sell assets and so allows a larger share to be paid at once. |
| `min_liquid_assets_pct` | Minimální procento aktiv podle čl. 9 odst. 1 písm. b) (likvidní aktiva) | Minimum Liquid Assets | What share of the fund must be permanently held in cash and easily sellable assets, so there is something to pay out from. The more frequent the redemptions, the larger the buffer the law requires. |
| `max_redemption_pct` | Maximální % odkupu | Maximum Redemption % | The highest share of the fund's available money that can be paid out on a single payout day. Calculated automatically from your choice of method, frequency and notice. |
| `liquid_assets_amount` | Likvidní aktiva | Liquid Assets | The value of the fund's easily sellable assets (cash, ordinary securities) from which payouts can be met. |
| `expected_cashflow_12m` | Očekávané roční cash flow | Expected 12m Cash Flow | Money the fund is highly certain to receive over the coming year (e.g. repayments, income). Money from new investors is not counted. |
| `redemption_cut_off` | Uzávěrka odkupů | Redemption Cut-Off Time | How many days before the payout day a redemption request must be received. |
| `redemption_dealing_date` | Výplatní den | Redemption Date | The day on which redemptions are processed. |
| `payment_of_redemption_proceeds` | Výplata odkupu | Payment of Redemption Proceeds | How many days after the payout day the investor receives the money. |
| `carry_policy` | Nakládání s nevyřízenou částí | Treatment of Unexecuted Requests | When more people request a redemption on one day than the fund may pay, requests are scaled down proportionally. Here you set what happens to the remainder: it automatically moves to the next payout day in the queue, or it lapses and the investor must request again, or the choice is left to the investor. |
| `min_holding_period` | Minimální doba držení | Minimum Holding Period | The shortest period an investor must hold units before first requesting a redemption. |
| `redemption_in_kind` | Výplata v nepeněžitém plnění | Repayment in Kind | Whether the fund may pay an exiting investor directly with a portion of its assets instead of cash. |
| `redemptions_simulation` | Simulace odkupů | Redemptions Simulation | An interactive demonstration: based on the fund's settings, it calculates when and how much an exiting investor would actually receive — including when many people want to exit at once. |
| `title` | Oslovení | Title | Salutation of the contact person (Ms / Mr). |
| `last_name` | Příjmení | Last Name | The contact person's surname. |
| `first_name` | Jméno | First Name | The contact person's given name. |
| `email` | E-mail | Email | The email to which the generated term sheet will be sent. |
| `company` | Společnost | Company | Your company's name. |
| `agreement` | Souhlas | Consent | I am aware that Finreg processes my personal data for the purpose of responding to my request. |
| `asset_class_x` | Kategorie aktiv | Asset Class | Which category the investment belongs to. The first seven are the ELTIF long-term "eligible" assets; the last is the liquid reserve. |
| `asset_class_amount_x` | Hodnota kategorie | Asset Class Amount | How much is invested in this category. |
| `eltif_capital` | Kapitál fondu | ELTIF Capital | The fund's investable capital (contributions plus uncalled commitments, net of fees) — the regulatory base against which investment limits are measured. |
| `nav` | Čistá hodnota aktiv | Net Asset Value | The fund's net value after deducting liabilities. |
| `total_assets` | Celkem investováno | Total Investment | The total amount invested (sum of the categories). |
| `total_eligible_pct` | Podíl způsobilých aktiv | Eligible Assets % | The share of long-term eligible assets in capital; at least 55% by law. |
| `avg_liquidity` | Průměrná likvidita | Average Liquidity | Indicative annual liquidity: how much of the fund's accessible portion can be redeemed per year, plus the number of redemption windows per year. |

---

## Příloha D — Regulační základ výpočtové vrstvy

- Kategorie způsobilých investičních aktiv: **čl. 10** nařízení (EU) 2015/760 (ve znění (EU) 2023/606).
- Min. **55 % kapitálu** ve způsobilých investičních aktivech: **čl. 13 odst. 1**.
- Diverzifikace **20 / 20 / 20 / 10 % kapitálu**: **čl. 13 odst. 2**; pro likvidní aktiva podle čl. 9 odst. 1 písm. b) platí limity koncentrace dle **čl. 56 odst. 2 směrnice 2009/65/ES (UCITS)** — **čl. 15 odst. 2**.
- Zápůjčky **50 % NAV** (retail): **čl. 16 odst. 1 písm. a)**.
- Rozdílný základ: skladba/diverzifikace = **kapitál** (čl. 13) vs. zápůjčky = **čistá hodnota aktiv / NAV** (čl. 16). Proto `total_assets` rozdělen na `eltif_capital` a `nav`.
