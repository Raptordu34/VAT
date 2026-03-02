# Récapitulatif VAT : Préparation au TD 4 (RTA) avec Exemples et Métaphores

Ce document résume les notions essentielles pour comprendre l'Analyse de Temps de Réponse (Response-Time Analysis - RTA). Pour rendre les mathématiques plus intuitives, nous utilisons l'analogie d'un **employé de bureau (le processeur)** qui doit traiter différents **types de dossiers (les tâches)**.

---

## 1. Bases de l'Ordonnancement Temps Réel (FTP - Fixed Task Priority)

Le TD 4 porte sur l'ordonnancement à **Priorités Fixes**.
Chaque tâche $\tau_i$ possède trois caractéristiques :
- **$C_i$ (Capacité / Temps d'exécution)** : Le temps que prend la tâche si on ne l'interrompt pas.
- **$D_i$ (Délai critique / Échéance)** : Le temps maximum autorisé pour terminer la tâche après son arrivée.
- **$T_i$ (Période)** : Le temps entre deux arrivées de cette tâche.

**L'analogie du bureau :**
- **$C_i$** : Le temps qu'il faut à l'employé pour remplir un dossier "Facture" (ex: 2 minutes).
- **$D_i$** : Le délai imposé par le patron ("Toute facture reçue doit être traitée en moins de 10 minutes").
- **$T_i$** : À quelle fréquence les factures arrivent sur le bureau (ex: une nouvelle facture arrive toutes les 15 minutes).

Les priorités sont fixes : par exemple, le patron décide que le "Dossier Client" (Priorité 1) passe TOUJOURS avant la "Facture" (Priorité 2). Si l'employé fait une facture et qu'un dossier client arrive, il lâche la facture, fait le dossier client, puis reprend la facture.

### Les grandes stratégies d'ordonnancement (Comment le patron choisit l'ordre)

Dans les systèmes temps réel, on utilise différents "algorithmes" (des règles) pour définir qui passe en premier. Voici les 4 grands classiques vus dans les TD précédents :

#### 1. Rate Monotonic (RM) - "Le plus fréquent d'abord"
- **Principe :** Priorité **Fixe**. Plus la période ($T_i$) d'une tâche est courte, plus sa priorité est élevée.
- **L'analogie :** Le Téléphone (sonne toutes les 5 min) est toujours plus prioritaire que le Courrier (arrive toutes les 4h).
- **Optimalité :** Optimal pour les systèmes à priorités fixes si $D_i = T_i$ (Échéance sur requête), monoprocesseur, préemptible et indépendant.

#### 2. Deadline Monotonic (DM) - "Le plus urgent d'abord"
- **Principe :** Priorité **Fixe**. Plus le délai critique ($D_i$) d'une tâche est court, plus sa priorité est élevée.
- **L'analogie :** Un dossier "À rendre dans 2 heures" passe toujours avant un dossier "À rendre demain", peu importe leur fréquence d'arrivée.
- **Optimalité :** Optimal si $D_i \le T_i$ (Échéances contraintes). (RM est en fait un cas particulier de DM).

#### 3. Earliest Deadline First (EDF) - "Celui qui va périmer en premier" (Vu au TD 2)
- **Principe :** Priorité **Dynamique**. On ne donne pas une priorité absolue à un *type* de tâche. À chaque instant, l'ordonnanceur regarde toutes les tâches présentes dans la file d'attente et exécute celle dont l'échéance **absolue** (l'heure exacte sur l'horloge où elle doit finir) est la plus proche.
- **L'analogie :** Comme un chef cuisinier qui regarde les bons de commande et prépare en premier le plat du client dont le temps d'attente maximum arrive à expiration dans 1 minute.
- **Avantage :** C'est l'algorithme le plus puissant. Si la charge $U \le 1$, EDF arrivera toujours à l'ordonnancer. L'inconvénient est qu'il demande plus de puissance de calcul au système d'exploitation qu'une simple priorité fixe.

#### 4. L'algorithme d'Audsley (OPA) - "Par élimination" (Vu au TD 3)
- **Principe :** Quand le système a des contraintes très particulières (ex: $D_i > T_i$, ou des portions non-préemptibles), RM et DM ne sont plus optimaux. L'algorithme d'Audsley (Optimal Priority Assignment) est une méthode en complexité polynomiale $O(n^2)$ pour trouver la bonne affectation des priorités fixes.
- **Méthode :** Au lieu de deviner qui est le 1er, on cherche le "moins pire" en partant de la fin. On prend une tâche au hasard et on la met à la priorité la plus basse possible. On simule : "Est-ce qu'elle rate son échéance avec cette pire place ?". 
  - Si OUI : On essaie avec une autre tâche.
  - Si NON : Parfait ! On la verrouille à cette dernière place, et on recommence le processus pour trouver l'avant-dernière place parmi les tâches restantes.

---

## 2. La Charge du Système (U)

La charge du système (aussi appelée taux d'utilisation du processeur, notée **$U$**) représente le pourcentage de temps total pendant lequel le processeur devra travailler pour exécuter toutes les tâches.

**Formule :**
Pour une tâche, sa part d'utilisation du processeur est $U_i = \frac{C_i}{T_i}$. 
Pour avoir la charge totale du système ($U$), on additionne la charge de toutes les $n$ tâches :
$$ U = \sum_{i=1}^{n} \frac{C_i}{T_i} $$

**Comment interpréter le résultat ?**
- **Si $U > 1$ (plus de 100%)** : Le système "déborde". Le processeur n'est pas assez rapide pour traiter le flux constant de tâches. Il est **trivialement non-ordonnançable** (c'est mathématiquement impossible de tout finir à temps).
- **Si $U \le 1$ (100% ou moins)** : Le système ne déborde pas de manière globale sur le long terme. Mais **attention**, cela ne garantit absolument pas qu'il est ordonnançable (il pourrait y avoir un problème de dépassement d'échéance à un instant précis si plusieurs tâches s'empilent !). C'est une simple "condition nécessaire". Pour avoir la preuve finale, il faut utiliser la RTA.

---

## 3. Le concept d'Instant Critique

**Définition mathématique :** C'est l'instant (généralement $t=0$) où toutes les tâches du système demandent à s'exécuter en même temps.

**L'analogie du bureau (Le lundi matin à 8h00) :**
Imagine que pendant le week-end, la boîte aux lettres s'est remplie. Lundi matin à 8h00, l'employé arrive et découvre sur son bureau : 1 Dossier Client (Priorité 1), 1 Facture (Priorité 2), et 1 Mail interne (Priorité 3).
C'est le **pire scénario possible** pour la tâche la moins prioritaire (le Mail interne), car elle va devoir attendre que TOUTES les autres soient terminées avant de commencer, et elle sera interrompue par les nouveaux dossiers qui arriveront entre temps.

**Pourquoi c'est important ?** Si on prouve que le Mail interne respecte son échéance $D_i$ lors du pire scénario (l'instant critique), alors on est sûr à 100% qu'il respectera son échéance le reste du temps.

---

## 4. Pourquoi la RTA plutôt que la Simulation ?

Au TD 2, on faisait de la **simulation** : on dessinait un grand chronogramme sur une feuille quadrillée.

**L'analogie :**
- **La Simulation** : C'est comme installer une caméra et filmer l'employé toute la journée pour vérifier s'il est un jour en retard. C'est long, fastidieux (si les périodes sont grandes, il faut dessiner pendant des heures pour couvrir tous les cas), et si un jour l'employé est un peu plus rapide ($C_i$ diminue), paradoxalement, ça peut créer un "effet papillon" qui le met en retard plus tard (anomalie d'ordonnancement).
- **La RTA (Analyse RTA)** : C'est une formule mathématique. Au lieu de filmer, on calcule directement : "Quel est le pire retard possible pour le Mail interne ?". C'est beaucoup plus rapide (pseudo-polynomial) et c'est une preuve absolue (Condition Nécessaire et Suffisante).

---

## 5. L'Interférence : Le cœur de la formule RTA

L'interférence, c'est le temps qu'une tâche perd à cause des tâches plus prioritaires qui lui "volent" le processeur.

**L'analogie de la lecture interrompue :**
Imagine que tu essaies de lire un livre de 100 pages (ta tâche de priorité basse). Normalement, ça te prend 2 heures ($C_i = 2h$).
Mais tu reçois des notifications de ton téléphone (priorité haute) :
- Chaque notification te prend 10 minutes à traiter ($C_j = 10 min$).
- Tu reçois une notification toutes les 45 minutes ($T_j = 45 min$).

Combien de temps vas-tu mettre pour finir ton livre ?
Au début, tu te dis : "Je finis en 2h".
Mais pendant ces 2h, le téléphone sonne. Combien de fois ? 
Il sonne à 0h, puis à 45m, puis à 1h30. Soit 3 fois !
Donc tes 2h de lecture sont rallongées de $3 \times 10 = 30$ minutes d'interférence.
Mais attention : pendant ces 30 minutes supplémentaires (de 2h à 2h30)... le téléphone a le temps de sonner une 4ème fois (à 2h15) ! Cela rajoute encore 10 minutes d'attente.

C'est exactement ça la RTA : on calcule une durée, qui ajoute des interruptions, qui rallongent la durée, qui permettent de nouvelles interruptions, etc. Jusqu'à ce que la durée se stabilise (c'est le **point fixe**).

---

## 6. La Formule RTA détaillée pas à pas

La formule sert à trouver ce "point fixe". On l'appelle $w_i$ (le temps de réponse de la tâche $\tau_i$).

$$ w_i^{n+1} = C_i + \sum_{j \in hp(i)} \left\lceil \frac{w_i^n}{T_j} \right\rceil \times C_j $$

Décortiquons-la avec nos concepts :
- $w_i^{n+1}$ : C'est notre nouvelle estimation du temps total (Livre + Téléphone). On l'améliore à chaque étape (n+1).
- $C_i$ : C'est le temps de base de notre tâche (Les 2h pour lire le livre).
- $\sum_{j \in hp(i)}$ : On additionne toutes les interruptions venant des tâches plus prioritaires (hp = higher priority).
- $\left\lceil \frac{w_i^n}{T_j} \right\rceil$ : C'est le nombre de fois où la tâche prioritaire $j$ se déclenche pendant notre temps d'estimation $w_i^n$.
  - *Note sur le symbole $\lceil x \rceil$ (ceil en anglais, "plafond")* : Cela veut dire qu'on arrondit toujours à l'entier supérieur. Si pendant 2h tu as reçu 2.6 appels, on compte 3 appels, car le 3ème appel a commencé et t'a interrompu.
- $\times C_j$ : On multiplie le nombre d'interruptions par le temps que dure chaque interruption (les 10 minutes par appel).

### Exemple de calcul concret :
Soit $\tau_1$ (priorité haute) : $C_1 = 1$, $T_1 = 4$
Soit $\tau_2$ (priorité basse) : $C_2 = 3$, $T_2 = 10$, $D_2 = 10$

On cherche le pire temps de réponse de $\tau_2$ ($w_2$).

**Étape 0 (Estimation initiale) :** On suppose qu'il n'y a pas d'interruption.
$w_2^0 = C_2 = 3$

**Étape 1 :** On regarde combien de fois $\tau_1$ a pu nous interrompre pendant ces 3 unités de temps.
$w_2^1 = 3 + \lceil \frac{3}{4} \rceil \times 1 = 3 + \lceil 0.75 \rceil \times 1 = 3 + (1 \times 1) = 4$
*(Pendant les 3 unités de temps, $\tau_1$ s'est activée 1 fois (à t=0). Le temps s'allonge à 4).*

**Étape 2 :** Notre fenêtre de temps est maintenant de 4. Est-ce que $\tau_1$ s'active plus de fois pendant 4 unités de temps ?
$w_2^2 = 3 + \lceil \frac{4}{4} \rceil \times 1 = 3 + \lceil 1 \rceil \times 1 = 3 + (1 \times 1) = 4$

**Fin !** $w_2^1 = w_2^2 = 4$. L'équation est stable, on a trouvé notre point fixe.
Le pire temps de réponse de $\tau_2$ est de 4. 
Comme $4 \le D_2$ (qui est 10), on conclut que la tâche $\tau_2$ respectera toujours son échéance. Le système est ordonnançable !

---
---

# Correction détaillée : TD 4 - Exercice 2 et 3

## Énoncé de l'exercice 2
Soit le système S1 de trois tâches indépendantes, périodiques, simultanées, à échéances sur requête, dont les paramètres $<C_i, T_i>$ sont donnés par :
- $\tau_1 = <2, 4>$
- $\tau_2 = <1, 4>$
- $\tau_3 = <1, 8>$

Le système est ordonnancé suivant **RM (Rate Monotonic)**.

---

### Rappel préalable : Déduction des paramètres du système
- **Simultanées** : Toutes les tâches démarrent en même temps à $t=0$ (Leurs dates de réveil $r_i = 0$). L'instant critique existe.
- **Échéance sur requête** : Le délai maximum pour finir la tâche est égal à sa période ($D_i = T_i$).
- **Ordonnancement RM** : La priorité est donnée à la période la plus courte. 

*Définissons les priorités pour S1 :*
$T_1 = 4$, $T_2 = 4$, $T_3 = 8$.
$\tau_1$ et $\tau_2$ ont la même période (4), donc la priorité la plus haute. En cas d'égalité, on départage arbitrairement par l'index (1 passe avant 2). $\tau_3$ a la période la plus longue (8), donc la priorité la plus faible.
- **Priorités : $P(\tau_1) > P(\tau_2) > P(\tau_3)$**
- $hp(1) = \emptyset$ *(Personne n'est plus prioritaire que $\tau_1$)*
- $hp(2) = \{\tau_1\}$ *(Seul $\tau_1$ peut interrompre $\tau_2$)*
- $hp(3) = \{\tau_1, \tau_2\}$ *(Les deux autres tâches peuvent interrompre $\tau_3$)*

---

## a) Calculer la charge du système S1, et conclure.

> **💡 RAPPEL DE COURS : La Charge du processeur ($U$)**
> La charge $U = \sum \frac{C_i}{T_i}$ représente le pourcentage d'occupation du processeur. 
> - Si $U > 1$ : Système mathématiquement impossible à ordonnancer (il sature).
> - Si $U \le 1$ : Condition nécessaire respectée, le système a une chance de fonctionner (mais ce n'est pas garanti sans calculs supplémentaires).

**Calcul :**
$$ U = \frac{C_1}{T_1} + \frac{C_2}{T_2} + \frac{C_3}{T_3} $$
$$ U = \frac{2}{4} + \frac{1}{4} + \frac{1}{8} $$
$$ U = 0.5 + 0.25 + 0.125 = 0.875 $$

**Conclusion :** 
La charge du système est de **0.875 (soit 87,5%)**. 
Puisque $U \le 1$, le système n'est pas trivialement non-ordonnançable. Le processeur est suffisamment puissant pour absorber la charge de travail globale, il faut maintenant vérifier qu'il n'y a pas de ratage d'échéance à l'instant critique.

---

## b) RM est-il optimal pour S1 ?

> **💡 RAPPEL DE COURS : Optimalité de Rate Monotonic**
> RM est optimal si et seulement si toutes les conditions suivantes sont réunies : 
> 1) Monoprocesseur, 2) Tâches indépendantes, 3) Préemptibles, 4) Instant critique existant (simultanées ou sporadiques), et 5) $D_i = T_i$.

**Analyse :**
D'après l'énoncé, le système S1 est composé de tâches :
1. Indépendantes (mentionné).
2. Simultanées (donc un instant critique existe à $t=0$).
3. À échéance sur requête, ce qui signifie que $D_i = T_i$ pour toutes les tâches.
4. On suppose implicitement qu'il est monoprocesseur et préemptible (contexte standard des TD).

**Conclusion :**
**Oui**, l'algorithme RM est **optimal** pour le système S1, car il respecte toutes les conditions de validité de Liu & Layland (dont la fameuse contrainte d'échéance sur requête $D_i = T_i$).

---

## c) La RTA est-elle exacte, pessimiste ou optimiste ?

> **💡 RAPPEL DE COURS : Précision de la RTA**
> - **Exacte** : Le pire scénario calculé par la RTA (l'instant critique où tout démarre en même temps) PEUT se produire dans la réalité.
> - **Pessimiste** : Le pire scénario calculé est impossible car les tâches ont des dates de début décalées ($r_i$ différents).

**Analyse :**
L'énoncé précise que les tâches sont **simultanées**. Cela signifie qu'à un moment donné (généralement $t=0$), toutes les tâches $\tau_1, \tau_2, \tau_3$ vont effectivement être déclenchées au même instant géométrique. Le "pire cas" théorique (l'instant critique) est donc un état physique réel du système.

**Conclusion :**
La RTA est **exacte**. Le pire temps de réponse calculé sera bel et bien observé lors de l'exécution (à l'instant $t=0$).

---

## d) Calculer avec la RTA le temps de réponse de chaque tâche, et conclure.

> **💡 RAPPEL DE COURS : Formule de la RTA**
> On cherche à calculer $w_i$, le temps de réponse de $\tau_i$. On procède par itérations (étapes) jusqu'à ce que le résultat se stabilise ($w_i^{k+1} = w_i^k$).
> Formule : $w_i^{k+1} = C_i + \sum_{j \in hp(i)} \left\lceil \frac{w_i^k}{T_j} \right\rceil \times C_j$
> *Initialisation : $w_i^0 = C_i$*

### 1. Temps de réponse de $\tau_1$
La tâche $\tau_1$ est la plus prioritaire ($hp(1)$ est vide). Personne ne peut l'interrompre.
- $w_1^0 = C_1 = 2$
- Aucune interférence possible, on a déjà notre point fixe : **$w_1 = 2$**
- **Vérification :** $TR_1 = 2 \le D_1 (4)$. $\tau_1$ est **ordonnançable**.

### 2. Temps de réponse de $\tau_2$
La tâche $\tau_2$ peut être interrompue uniquement par $\tau_1$.
- **Étape 0 :** $w_2^0 = C_2 = 1$
- **Étape 1 :** On intègre l'interférence de $\tau_1$ pendant la fenêtre de temps de 1.
  $w_2^1 = C_2 + \left\lceil \frac{w_2^0}{T_1} \right\rceil \times C_1$
  $w_2^1 = 1 + \left\lceil \frac{1}{4} \right\rceil \times 2$
  $w_2^1 = 1 + (1 \times 2) = 3$ *(Pendant 1 unité de temps, $\tau_1$ a eu le temps de s'activer 1 fois)*
- **Étape 2 :** On met à jour avec la nouvelle fenêtre de temps de 3.
  $w_2^2 = 1 + \left\lceil \frac{3}{4} \right\rceil \times 2$
  $w_2^2 = 1 + (1 \times 2) = 3$
- **Point fixe atteint** car $w_2^1 = w_2^2 = 3$. Le pire temps de réponse est **$w_2 = 3$**.
- **Vérification :** $TR_2 = 3 \le D_2 (4)$. $\tau_2$ est **ordonnançable**.

### 3. Temps de réponse de $\tau_3$
La tâche $\tau_3$ peut être interrompue par $\tau_1$ ET par $\tau_2$.
- **Étape 0 :** $w_3^0 = C_3 = 1$
- **Étape 1 :** On intègre l'interférence de $\tau_1$ et $\tau_2$ pendant la fenêtre de 1.
  $w_3^1 = C_3 + \left( \left\lceil \frac{1}{T_1} \right\rceil \times C_1 \right) + \left( \left\lceil \frac{1}{T_2} \right\rceil \times C_2 \right)$
  $w_3^1 = 1 + \left( \left\lceil \frac{1}{4} \right\rceil \times 2 \right) + \left( \left\lceil \frac{1}{4} \right\rceil \times 1 \right)$
  $w_3^1 = 1 + (1 \times 2) + (1 \times 1)$
  $w_3^1 = 1 + 2 + 1 = 4$
- **Étape 2 :** On met à jour avec la nouvelle fenêtre de temps de 4.
  $w_3^2 = 1 + \left\lceil \frac{4}{4} \right\rceil \times 2 + \left\lceil \frac{4}{4} \right\rceil \times 1$
  $w_3^2 = 1 + (1 \times 2) + (1 \times 1)$
  $w_3^2 = 1 + 2 + 1 = 4$
- **Point fixe atteint** car $w_3^1 = w_3^2 = 4$. Le pire temps de réponse est **$w_3 = 4$**.
- **Vérification :** $TR_3 = 4 \le D_3 (8)$. $\tau_3$ est **ordonnançable**.

### Conclusion finale pour l'Exercice 2
Puisque le temps de réponse $TR_i$ de chaque tâche est inférieur ou égal à son délai critique $D_i$ ($2 \le 4$, $3 \le 4$, et $4 \le 8$), **le système S1 est parfaitement ordonnançable sous RM.**

---
---

## Énoncé de l'exercice 3
Soit le système S2 de trois tâches indépendantes, **sporadiques**, à échéances sur requête, dont les paramètres $<C_i, T_i>$ sont donnés par :
- $\tau_1 = <2, 7>$
- $\tau_2 = <2, 4>$
- $\tau_3 = <3, 14>$

Le système est ordonnancé suivant **RM (Rate Monotonic)**.

---

### Nouveauté du système S2 : Tâches Sporadiques
> **💡 RAPPEL DE COURS : Tâches Sporadiques**
> Contrairement aux tâches périodiques qui s'activent exactement toutes les $T_i$ unités de temps, une tâche **sporadique** s'active de manière imprévisible, mais avec un **délai minimum** entre deux activations, qui est noté $T_i$.
> - $T_i$ n'est plus "l'intervalle exact", c'est "l'intervalle minimum".
> - **Conséquence pour le pire cas :** Si l'on cherche le pire scénario (ce que fait la RTA), on doit supposer que les tâches sporadiques s'activent le plus vite possible, c'est-à-dire exactement toutes les $T_i$. Dans l'analyse, elles se comportent donc mathématiquement comme des tâches périodiques simultanées !

### Déduction des paramètres
- **Échéance sur requête** : Donc $D_i = T_i$.
  - $D_1 = 7$, $D_2 = 4$, $D_3 = 14$
- **Ordonnancement RM** : On classe par période ($T_i$) croissante.
  - $T_2 (4) < T_1 (7) < T_3 (14)$
- **Priorités : $P(\tau_2) > P(\tau_1) > P(\tau_3)$**
  - $hp(2) = \emptyset$ *(Priorité maximale)*
  - $hp(1) = \{\tau_2\}$
  - $hp(3) = \{\tau_2, \tau_1\}$

*(Attention : L'indice des tâches ne correspond plus à leur ordre de priorité. Reste vigilant(e) lors des calculs d'interférence !)*

---

## a) Calculer la charge du système S2, et conclure.

**Calcul :**
$$ U = \frac{C_1}{T_1} + \frac{C_2}{T_2} + \frac{C_3}{T_3} $$
$$ U = \frac{2}{7} + \frac{2}{4} + \frac{3}{14} $$
Mise au même dénominateur (14) :
$$ U = \frac{4}{14} + \frac{7}{14} + \frac{3}{14} = \frac{14}{14} $$
$$ U = 1 $$

**Conclusion :**
La charge du système est de **1 (soit 100%)**. 
Le processeur est utilisé à son maximum absolu, il n'y a aucun temps mort (idle time). Comme $U \le 1$, le système n'est pas "mathématiquement impossible", mais il est critique. La moindre interférence mal placée peut faire rater une échéance. La RTA est indispensable.

---

## b) RM est-il optimal pour S2 ?

**Analyse :**
Les tâches sont sporadiques, indépendantes, monoprocesseur (implicite), et surtout **à échéances sur requête ($D_i = T_i$)**.
Le fait qu'elles soient sporadiques garantit l'existence d'un instant critique théorique (le cas où elles démarrent toutes en même temps à leur rythme maximum).

**Conclusion :**
**Oui**, RM reste **optimal**.

---

## c) La RTA est-elle exacte, pessimiste ou optimiste ?

**Analyse :**
Pour des tâches sporadiques, l'instant critique ($t=0$ où toutes s'activent ensemble, puis réactivations systématiques le plus tôt possible) est un comportement **physiquement possible**. Comme le rôle de l'ordonnanceur est de garantir que le système ne plantera jamais même dans la pire situation autorisée, ce scénario doit être pris en compte.

**Conclusion :**
La RTA est **exacte**.

---

## d) Calculer avec la RTA le temps de réponse de chaque tâche, et conclure.

*(On rappelle l'ordre de priorité : $\tau_2$, puis $\tau_1$, puis $\tau_3$)*

### 1. Temps de réponse de $\tau_2$ (Priorité 1)
$hp(2)$ est vide.
- $w_2^0 = C_2 = 2$
- Point fixe atteint : **$w_2 = 2$**
- **Vérification :** $TR_2 = 2 \le D_2 (4)$. $\tau_2$ est **ordonnançable**.

### 2. Temps de réponse de $\tau_1$ (Priorité 2)
$\tau_1$ peut être interrompue par $\tau_2$.
- **Étape 0 :** $w_1^0 = C_1 = 2$
- **Étape 1 :** 
  $w_1^1 = C_1 + \left\lceil \frac{w_1^0}{T_2} \right\rceil \times C_2$
  $w_1^1 = 2 + \left\lceil \frac{2}{4} \right\rceil \times 2 = 2 + (1 \times 2) = 4$
- **Étape 2 :** 
  $w_1^2 = 2 + \left\lceil \frac{4}{4} \right\rceil \times 2 = 2 + (1 \times 2) = 4$
- Point fixe atteint à **$w_1 = 4$**.
- **Vérification :** $TR_1 = 4 \le D_1 (7)$. $\tau_1$ est **ordonnançable**.

### 3. Temps de réponse de $\tau_3$ (Priorité 3) - Formule de Lehoczky
$\tau_3$ subit les interférences de $\tau_2$ ET de $\tau_1$.

> **💡 RAPPEL DE COURS : Formule de Lehoczky (1990)**
> Si au cours du calcul, le temps de réponse dépasse la période ($w_i > T_i$), cela signifie que l'instance *suivante* de la tâche arrive avant que la première n'ait eu le temps de terminer ! La "période d'activité" continue donc.
> Il faut alors calculer le temps de réponse de la 2ème instance ($k=2$), puis éventuellement de la 3ème, etc. jusqu'à ce qu'une instance se termine *avant* l'arrivée de sa suivante ($w_i^*(k) \le k \times T_i$). Le pire temps de réponse final de la tâche sera le maximum de tous ceux observés dans cette période d'activité.

**A. Calcul pour la 1ère instance ($k=1$) :**
- **Étape 0 :** $w_3^0(1) = C_3 = 3$
- **Étape 1 :** $w_3^1(1) = 3 + \left\lceil \frac{3}{4} \right\rceil \times 2 + \left\lceil \frac{3}{7} \right\rceil \times 2 = 3 + 2 + 2 = 7$
- **Étape 2 :** $w_3^2(1) = 3 + \left\lceil \frac{7}{4} \right\rceil \times 2 + \left\lceil \frac{7}{7} \right\rceil \times 2 = 3 + 4 + 2 = 9$
- **Étape 3 :** $w_3^3(1) = 3 + \left\lceil \frac{9}{4} \right\rceil \times 2 + \left\lceil \frac{9}{7} \right\rceil \times 2 = 3 + 6 + 4 = 13$
- **Étape 4 :** $w_3^4(1) = 3 + \left\lceil \frac{13}{4} \right\rceil \times 2 + \left\lceil \frac{13}{7} \right\rceil \times 2 = 3 + 8 + 4 = 15$
- **Étape 5 :** $w_3^5(1) = 3 + \left\lceil \frac{15}{4} \right\rceil \times 2 + \left\lceil \frac{15}{7} \right\rceil \times 2 = 3 + 8 + 6 = 17$
- **Étape 6 :** $w_3^6(1) = 3 + \left\lceil \frac{17}{4} \right\rceil \times 2 + \left\lceil \frac{17}{7} \right\rceil \times 2 = 3 + 10 + 6 = 19$
- **Étape 7 :** $w_3^7(1) = 3 + \left\lceil \frac{19}{4} \right\rceil \times 2 + \left\lceil \frac{19}{7} \right\rceil \times 2 = 3 + 10 + 6 = \mathbf{19}$

Point fixe atteint : **$w_3^*(1) = 19$**.
Le temps de réponse de la 1ère instance est $TR_3(1) = 19$. 
**Attention :** $19 > T_3 (14)$. La première instance déborde sur la période de la deuxième. La période d'activité n'est pas finie, on doit vérifier l'instance $k=2$.

**B. Calcul pour la 2ème instance ($k=2$) :**
Pour $k=2$, la tâche demande $2 \times C_3$ de temps d'exécution (soit 6).
On peut utiliser le point fixe précédent comme point de départ pour gagner du temps : $w_3^0(2) = 19$.
- **Étape 1 :** $w_3^1(2) = (2 \times 3) + \left\lceil \frac{19}{4} \right\rceil \times 2 + \left\lceil \frac{19}{7} \right\rceil \times 2 = 6 + 10 + 6 = 22$
- **Étape 2 :** $w_3^2(2) = 6 + \left\lceil \frac{22}{4} \right\rceil \times 2 + \left\lceil \frac{22}{7} \right\rceil \times 2 = 6 + 12 + 8 = 26$
- **Étape 3 :** $w_3^3(2) = 6 + \left\lceil \frac{26}{4} \right\rceil \times 2 + \left\lceil \frac{26}{7} \right\rceil \times 2 = 6 + 14 + 8 = 28$
- **Étape 4 :** $w_3^4(2) = 6 + \left\lceil \frac{28}{4} \right\rceil \times 2 + \left\lceil \frac{28}{7} \right\rceil \times 2 = 6 + 14 + 8 = \mathbf{28}$

Point fixe atteint : **$w_3^*(2) = 28$**.
Vérifions si la période d'activité se termine : $28 \le 2 \times T_3$ (car $2 \times 14 = 28$). **Oui !** La période d'activité s'arrête exactement à la fin de la 2ème période.
Le temps de réponse de la 2ème instance se calcule par rapport à sa propre date de réveil : 
$TR_3(2) = w_3^*(2) - (k-1) \times T_3 = 28 - 14 = \mathbf{14}$.

**C. Temps de réponse final :**
Le pire temps de réponse de $\tau_3$ est le maximum observé pendant toute la période d'activité :
$TR_3 = \max(TR_3(1), TR_3(2)) = \max(19, 14) = \mathbf{19}$.

### Conclusion finale pour l'Exercice 3
Le pire temps de réponse de $\tau_3$ est de 19 (subi par la première instance).
Or, son délai critique est $D_3 = 14$. 
Puisque $19 > 14$, la tâche $\tau_3$ rate son échéance dans le pire des cas (l'instant critique).
Par conséquent, bien que la charge CPU soit valide ($U=100\%$), **le système S2 N'EST PAS ordonnançable sous RM.** 
C'est un excellent exemple d'un système qui sature : l'accumulation d'interruptions finit par faire déborder la dernière tâche, obligeant à utiliser la formule généralisée de Lehoczky pour trouver le vrai temps de réponse (19).

---
---

# Correction détaillée : TD 4 - Exercice 4

## Énoncé de l'exercice 4
Soit le système S3 de trois tâches indépendantes, périodiques, à échéances sur requête, **à départs différés**, dont les paramètres $<O_i, C_i, T_i>$ sont donnés par :
- $\tau_1 = <0, 1, 4>$
- $\tau_2 = <1, 3, 6>$
- $\tau_3 = <2, 1, 4>$

Le système est ordonnancé suivant **RM (Rate Monotonic)**.

---

### Rappel préalable : Déduction des paramètres du système
- **Départs différés (Offsets $O_i$)** : Les tâches ne démarrent pas en même temps.
  - $\tau_1$ est prête à $t=0$
  - $\tau_2$ est prête à $t=1$
  - $\tau_3$ est prête à $t=2$
- **Échéance sur requête** : Le délai maximum pour finir la tâche est égal à sa période ($D_i = T_i$).
  - $D_1 = 4$, $D_2 = 6$, $D_3 = 4$
- **Ordonnancement RM** : La priorité est donnée à la période la plus courte. 
  - $T_1 = 4$, $T_3 = 4$, $T_2 = 6$
  - On départage $\tau_1$ et $\tau_3$ par l'indice : **Priorités : $P(\tau_1) > P(\tau_3) > P(\tau_2)$**
  - $hp(1) = \emptyset$
  - $hp(3) = \{\tau_1\}$
  - $hp(2) = \{\tau_1, \tau_3\}$

---

## a) Calculer la charge du système S3, et conclure.

**Calcul :**
$$ U = \frac{C_1}{T_1} + \frac{C_2}{T_2} + \frac{C_3}{T_3} $$
$$ U = \frac{1}{4} + \frac{3}{6} + \frac{1}{4} $$
$$ U = 0.25 + 0.5 + 0.25 = 1 $$

**Conclusion :** 
La charge du système est de **1 (soit 100%)**. 
Puisque $U \le 1$, le système satisfait la condition nécessaire. Il n'est pas trivialement non-ordonnançable, mais le processeur sera utilisé sans aucun temps mort.

---

## b) RM est-il optimal pour S3 ?

**Analyse :**
Bien que les tâches soient indépendantes, préemptibles, sur un monoprocesseur, et avec $D_i = T_i$, il y a un problème majeur : les **départs différés** (les Offsets $O_i$ sont différents).
Il n'y a donc pas d'instant critique (où toutes les tâches démarrent exactement en même temps).

**Conclusion :**
**Non**, l'algorithme RM n'est **pas optimal** pour un système avec des départs asynchrones (différés).

---

## c) La RTA est-elle exacte, pessimiste ou optimiste ?

**Analyse :**
La RTA classique se base sur le théorème de l'instant critique, c'est-à-dire qu'elle fait "comme si" toutes les tâches démarraient à $t=0$ pour simuler le pire cas d'interférence possible.
Cependant, dans S3, ce scénario est **physiquement impossible** dès le démarrage (les tâches démarrent à 0, 1 et 2). Il est possible que ces tâches se synchronisent plus tard (il faudrait étudier le PPCM des périodes pour le savoir), mais la RTA classique va calculer une interférence maximale en forçant un alignement artificiel à $t=0$.

**Conclusion :**
La RTA sera **pessimiste**. Elle va donner un temps de réponse majorant, qui pourrait être supérieur au pire temps de réponse réel observé.

---

## d) Calculer avec la RTA le temps de réponse de chaque tâche, et conclure.

*(Rappel des priorités : $\tau_1 > \tau_3 > \tau_2$)*
*(Rappel de la formule : on ignore les offsets $O_i$ et on fait comme si tout démarrait à 0).*

### 1. Temps de réponse de $\tau_1$ (Priorité 1)
- $w_1 = C_1 = 1$
- **Vérification :** $TR_1 = 1 \le D_1 (4)$.

### 2. Temps de réponse de $\tau_3$ (Priorité 2)
$\tau_3$ est interrompue par $\tau_1$.
- **Étape 0 :** $w_3^0 = C_3 = 1$
- **Étape 1 :** 
  $w_3^1 = 1 + \left\lceil \frac{1}{4} \right\rceil \times 1 = 1 + (1 \times 1) = 2$
- **Étape 2 :** 
  $w_3^2 = 1 + \left\lceil \frac{2}{4} \right\rceil \times 1 = 1 + 1 = 2$
- Point fixe à **$w_3 = 2$**.
- **Vérification :** $TR_3 = 2 \le D_3 (4)$.

### 3. Temps de réponse de $\tau_2$ (Priorité 3)
$\tau_2$ est interrompue par $\tau_1$ et $\tau_3$.
- **Étape 0 :** $w_2^0 = C_2 = 3$
- **Étape 1 :**
  $w_2^1 = 3 + \left( \left\lceil \frac{3}{4} \right\rceil \times 1 \right) + \left( \left\lceil \frac{3}{4} \right\rceil \times 1 \right)$
  $w_2^1 = 3 + 1 + 1 = 5$
- **Étape 2 :**
  $w_2^2 = 3 + \left\lceil \frac{5}{4} \right\rceil \times 1 + \left\lceil \frac{5}{4} \right\rceil \times 1$
  $w_2^2 = 3 + 2 + 2 = 7$
> **⚠️ ALERTE DÉPASSEMENT D'ÉCHÉANCE**
> $TR_2 = 7$, ce qui est supérieur au délai critique $D_2 = 6$.

### Conclusion de la RTA sous RM :
D'après la RTA, la tâche $\tau_2$ rate son échéance, donc le système **n'est pas ordonnançable** sous RM.

---

## d-bis) OPA (Audsley) peut-il trouver une meilleure affectation de priorités ?

Puisque RM échoue au test de la RTA, le prof tente d'utiliser l'algorithme d'Audsley (OPA) pour voir si une *autre* affectation de priorités permettrait de passer le test mathématique.

> **💡 RAPPEL DE COURS : OPA (Optimal Priority Assignment / Audsley)**
> OPA construit l'ordre des priorités "à l'envers", en partant de la priorité la plus basse (ici le niveau 3) pour remonter vers la priorité 1.
> Pour trouver qui mettre au niveau 3, on prend les tâches une par une et on calcule leur RTA en supposant que *toutes les autres tâches existantes* sont plus prioritaires (peu importe leur ordre exact entre elles, elles feront toutes interférence). Si une tâche respecte son $D_i$, on la valide à ce niveau. Sinon on en essaie une autre.

**Cherchons le candidat pour la Priorité 3 (la plus basse) :**

1. **Testons $\tau_1$ à la priorité 3** : Elle subit l'interférence de $\tau_2$ et $\tau_3$.
   Dès l'étape 1 : $w_1^1 = C_1 + C_2 + C_3 = 1 + 3 + 1 = 5$
   Or, son échéance est $D_1 = 4$. **Échec** ($5 > 4$). $\tau_1$ ne peut pas être à la priorité 3.

2. **Testons $\tau_3$ à la priorité 3** : Elle subit l'interférence de $\tau_1$ et $\tau_2$.
   Dès l'étape 1 : $w_3^1 = C_3 + C_1 + C_2 = 1 + 1 + 3 = 5$
   Or, son échéance est $D_3 = 4$. **Échec** ($5 > 4$). $\tau_3$ ne peut pas être à la priorité 3.

3. **Testons $\tau_2$ à la priorité 3** : (C'est exactement le cas de figure de RM que l'on vient de calculer au-dessus !)
   Le point fixe est à $w_2 = 7$.
   Or, son échéance est $D_2 = 6$. **Échec** ($7 > 6$). $\tau_2$ ne peut pas non plus être à la priorité 3.

**Conclusion d'OPA :**
Aucune des trois tâches ne survit à la priorité la plus basse. L'algorithme d'Audsley est bloqué dès la première étape.
Il n'existe donc **AUCUNE affectation de priorités fixes** qui permette de valider ce système en utilisant la formule RTA classique.
Cela met en évidence à quel point le test mathématique RTA est beaucoup trop *pessimiste* pour les systèmes à départs différés.

---

## e) La simulation est-elle exacte, pessimiste ou optimiste pour S3 ?

> **💡 RAPPEL DE COURS : Précision d'une simulation**
> Contrairement à la formule RTA qui "invente" un pire cas, une simulation est le tracé exact de ce qui va se passer dans le processeur, seconde par seconde.
> 
> Pour savoir si ce qu'on observe sur le dessin est une preuve absolue (Exacte) ou non, il faut regarder si le système est soumis à des **variations imprévisibles**.
> - **Exacte :** Si le système est **totalement déterministe**. C'est-à-dire : tâches strictement périodiques (pas de sporadiques), temps d'exécution constants (le $C_i$ est toujours atteint, pas de "au pire $C_i$"), et pas de ressources partagées qui pourraient créer des temps d'attente variables. Dans ce cas, le dessin de la simulation EST la réalité.
> - **Optimiste (Dangereux !) :** La simulation d'un système est presque toujours **optimiste** dès qu'il y a de l'imprévu. Par exemple :
>   - Si les tâches sont *sporadiques* : la simulation va tracer *un* cas possible (souvent en les faisant démarrer le plus vite possible), mais elle ne peut pas tracer la vraie infinité des combinaisons d'arrivées imprévisibles. Elle pourrait rater le "vrai" pire cas.
>   - S'il y a des *ressources partagées* (mutex) ou des *contraintes de précédence* : une infime variation de vitesse d'une tâche peut créer un "effet papillon" (anomalie d'ordonnancement de Richard) qui retarde tout le monde plus tard.
> - **Pessimiste :** Une simulation n'est par définition jamais pessimiste. Elle trace au pire une version édulcorée de la réalité (optimiste), au mieux la stricte réalité (exacte).

**Analyse pour le système S3 :**
L'énoncé de S3 précise que les tâches sont :
1. **Indépendantes** (pas de mutex, pas de précédence).
2. **Périodiques** (elles s'activent avec une rigidité d'horloge suisse selon $T_i$, ce ne sont pas des sporadiques).
3. Leurs dates de premier réveil (offsets $O_i$) sont **fixes et connues** (0, 1 et 2).
4. On suppose (comme toujours dans ces exercices sauf mention contraire) que le temps d'exécution $C_i$ est constant.

Puisque tout est rigide et mathématiquement prévisible, le tracé du chronogramme correspondra exactement au comportement physique du processeur dans la vraie vie. Il n'y a aucune place pour le hasard.

**Conclusion :**
La simulation pour le système S3 est **exacte**. 
*(C'est pour cela que dans la question f, on va pouvoir se fier aveuglément à la simulation pour contredire le résultat de la RTA !)*

---

## f) Tracer la simulation et comparer.

*(Voir l'animation HTML jointe `animation_simu_ex4.html` pour le tracé interactif détaillé).*

**Comparaison RTA vs Simulation :**
- **RTA** : Prédit que $\tau_2$ rate son échéance avec un temps de réponse de **7**.
- **Simulation** : Si l'on trace le chronogramme (voir l'animation), on s'aperçoit que les désynchronisations des départs ($O_i$) empêchent les tâches $\tau_1$ et $\tau_3$ de s'aligner parfaitement pour causer l'interférence maximale prédite de 7 unités.
  - La charge est de 100%, le processeur est tout le temps occupé, mais **$\tau_2$ réussit toujours à finir juste à temps à son échéance (temps de réponse réel max = 6)**.

---
---

# Correction détaillée : TD 4 - Exercice 5

## Énoncé de l'exercice 5
Soit le système S4 de deux tâches indépendantes, **sporadiques**, dont les paramètres $<C_i, D_i, T_i>$ sont donnés par :
- $\tau_1 = <26, 26, 70>$
- $\tau_2 = <62, 118, 100>$

Le système est ordonnancé suivant **DM (Deadline Monotonic)**.

Cet exemple (tiré de Lehoczky, 1990) illustre le fait que ce n'est pas forcément la première instance qui possède le plus long temps de réponse, mais l'une des instances se trouvant dans la plus longue période d'activité.

---

### Rappel préalable : Déduction des paramètres du système
- **Tâches sporadiques** : Cela garantit l'existence théorique d'un instant critique (le pire cas où elles démarrent en même temps à leur rythme maximum). La RTA classique sera utilisable.
- **Ordonnancement DM** : La priorité est donnée au Délai Critique ($D_i$) le plus court.
  - $D_1 = 26$, $D_2 = 118$
  - Comme $26 < 118$, $\tau_1$ est plus prioritaire que $\tau_2$.
  - **Priorités : $P(\tau_1) > P(\tau_2)$**
  - $hp(1) = \emptyset$
  - $hp(2) = \{\tau_1\}$

---

## a) Calculer la charge du système S4, et conclure.

**Calcul :**
$$ U = \frac{C_1}{T_1} + \frac{C_2}{T_2} $$
$$ U = \frac{26}{70} + \frac{62}{100} $$
$$ U \approx 0.371 + 0.62 $$
$$ U \approx 0.991 $$

**Conclusion :**
La charge du système est de **99,1%**. 
Puisque $U \le 1$, le système n'est pas trivialement non-ordonnançable. Le processeur est capable d'absorber la charge globale (de justesse !). Il faut utiliser la RTA pour vérifier s'il n'y a pas de dépassement d'échéance à l'instant critique.

---

## b) DM est-il optimal pour S4 ?

> **💡 RAPPEL DE COURS : Optimalité de Deadline Monotonic (DM)**
> DM est le "grand frère" de RM. Il est optimal pour l'affectation de priorités fixes si toutes les conditions de Liu & Layland sont respectées, mais avec une tolérance supplémentaire : **les échéances peuvent être inférieures ou égales aux périodes ($D_i \le T_i$)**.
> (Rappel : RM exigeait strictement $D_i = T_i$).

**Analyse :**
Vérifions les conditions pour le système S4 :
1. Monoprocesseur ? Oui (implicite).
2. Tâches indépendantes ? Oui (énoncé).
3. Préemptibles ? Oui (implicite).
4. Instant critique existant ? Oui, car les tâches sont **sporadiques** (le pire cas d'alignement est possible).
5. Échéances contraintes ($D_i \le T_i$) ?
   - Pour $\tau_1$ : $D_1 (26) \le T_1 (70)$ 👉 Vrai.
   - Pour $\tau_2$ : $D_2 (118) \le T_2 (100)$ 👉 **FAUX !** ($118 > 100$). 
   Ici, l'échéance de la tâche 2 est **arbitraire** (plus grande que sa période). Cela veut dire qu'une nouvelle instance de $\tau_2$ peut arriver alors que la précédente a encore le droit de s'exécuter.

**Conclusion :**
**Non**, DM n'est **pas optimal** pour S4 car la tâche $\tau_2$ a une échéance supérieure à sa période ($D_2 > T_2$).
*(Note : Quand $D_i > T_i$, il n'existe d'ailleurs aucun algorithme d'affectation de priorités fixes qui soit toujours optimal, sauf à tester par force brute avec Audsley/OPA s'il trouve une solution).*

---

## c) La RTA est-elle exacte, pessimiste ou optimiste ?

**Analyse :**
Les tâches sont **sporadiques**. Comme vu précédemment, pour des tâches sporadiques, le scénario de l'instant critique (où toutes les tâches s'activent en même temps à l'instant $t=0$ puis se réactivent frénétiquement à leur rythme maximum) est un scénario **physiquement possible**. La formule mathématique modélise donc un cas qui peut exister dans la réalité.

**Conclusion :**
La RTA est **exacte**.

---

## d) Calculer avec la RTA le temps de réponse de la première instance de $\tau_2$ ($k=1$).

La tâche $\tau_2$ est interrompue par $\tau_1$.
*(On utilise la formule généralisée de Lehoczky)*

- **Étape 0 :** $w_2^0(1) = C_2 = 62$
- **Étape 1 :** $w_2^1(1) = 62 + \left\lceil \frac{62}{70} \right\rceil \times 26 = 62 + (1 \times 26) = 88$
- **Étape 2 :** $w_2^2(1) = 62 + \left\lceil \frac{88}{70} \right\rceil \times 26 = 62 + (2 \times 26) = 62 + 52 = 114$
- **Étape 3 :** $w_2^3(1) = 62 + \left\lceil \frac{114}{70} \right\rceil \times 26 = 62 + (2 \times 26) = 114$

**Point fixe atteint :** $w_2^*(1) = 114$.
Le temps de réponse de la 1ère instance est **$TR_2(1) = 114$**.

> **⚠️ Vérification de la fin de période d'activité (Lehoczky) :**
> Est-ce que $114 \le T_2$ ? Non ! ($114 > 100$).
> Le temps de réponse de la première instance (114) a **dépassé la période** (100). Cela signifie que la 2ème instance de $\tau_2$ est arrivée à l'instant $t=100$, et qu'elle attend déjà ! La période d'activité n'est pas terminée, il faut évaluer la 2ème instance.

*(Cependant, notons que $114 \le D_2 (118)$, donc cette première instance respecte bien son échéance).*

---

## e) Calculer avec la RTA le temps de réponse de la seconde instance de $\tau_2$ ($k=2$).

Pour la 2ème instance ($k=2$), la tâche $\tau_2$ demande $2 \times C_2$ d'exécution (soit $2 \times 62 = 124$).
On part du dernier temps trouvé pour gagner des itérations.

- **Étape 0 :** $w_2^0(2) = 114$ *(ou 124 si on prend la charge brute)*
- **Étape 1 :** $w_2^1(2) = 124 + \left\lceil \frac{114}{70} \right\rceil \times 26 = 124 + (2 \times 26) = 124 + 52 = 176$
- **Étape 2 :** $w_2^2(2) = 124 + \left\lceil \frac{176}{70} \right\rceil \times 26 = 124 + (3 \times 26) = 124 + 78 = 202$
- **Étape 3 :** $w_2^3(2) = 124 + \left\lceil \frac{202}{70} \right\rceil \times 26 = 124 + (3 \times 26) = 202$

**Point fixe atteint :** $w_2^*(2) = 202$.
Cette 2ème instance se termine à l'instant absolu $t=202$.

> **Vérification de la fin de période d'activité :**
> Est-ce que $202 \le 2 \times T_2$ ? Non ! ($202 > 200$).
> La 3ème instance vient d'arriver, la période d'activité continue !

**Calcul du temps de réponse de la 2ème instance :**
La 2ème instance est arrivée à l'instant $T_2$ (100) et s'est terminée à l'instant 202.
Son temps de réponse est donc :
$TR_2(2) = w_2^*(2) - (k-1) \times T_2$
$TR_2(2) = 202 - 100 = \mathbf{102}$.

---

## f) Calcul de la 5ème instance (le pire temps de réponse)

L'énoncé nous dit que c'est la 5ème instance ($k=5$) de $\tau_2$ qui va subir le pire temps de réponse de toute la période d'activité (qui en compte 7 en tout).
Calculons ce temps de réponse avec la RTA de Lehoczky.

Pour $k=5$, la tâche demande $5 \times C_2$ d'exécution (soit $5 \times 62 = 310$).

- **Étape 0 :** $w_2^0(5) = 310$
- **Étape 1 :** $w_2^1(5) = 310 + \left\lceil \frac{310}{70} \right\rceil \times 26 = 310 + (5 \times 26) = 310 + 130 = 440$
- **Étape 2 :** $w_2^2(5) = 310 + \left\lceil \frac{440}{70} \right\rceil \times 26 = 310 + (7 \times 26) = 310 + 182 = 492$
- **Étape 3 :** $w_2^3(5) = 310 + \left\lceil \frac{492}{70} \right\rceil \times 26 = 310 + (8 \times 26) = 310 + 208 = 518$
- **Étape 4 :** $w_2^4(5) = 310 + \left\lceil \frac{518}{70} \right\rceil \times 26 = 310 + (8 \times 26) = 518$

**Point fixe atteint :** $w_2^*(5) = 518$.
Cette 5ème instance se termine à l'instant absolu $t=518$.

**Calcul de son temps de réponse réel :**
La 5ème instance est arrivée à l'instant $(k-1) \times T_2 = 4 \times 100 = 400$.
Son temps de réponse est :
$TR_2(5) = w_2^*(5) - 400$
$TR_2(5) = 518 - 400 = \mathbf{118}$.

### Conclusion de l'exercice 5
Le temps de réponse de la 5ème instance est de **118**. 
C'est le pire de toute la période d'activité. Comme $D_2 = 118$, la tâche termine *exactement* à son échéance dans le pire des cas (mais ne la dépasse pas). 
Le système S4 est donc **ordonnançable sous DM** de justesse !

---
---

# Correction détaillée : TD 4 - Exercice 6

## Énoncé de l'exercice 6
En observant la RBF (Request Bound Function) donnée sur la Figure 3, qu'adviendrait-il de la durée de la période d'activité si :
a) Une durée d'exécution de tâche était moins longue ?
b) Une période était plus longue que prévue ?
c) Une date de réveil était plus grande que 0 ?
d) Peut-on en déduire que la RTA est C-viable, r-viable, et T-viable ?

---

> **💡 RAPPEL DE COURS : La viabilité (Viability)**
> Un test d'ordonnançabilité est dit **viable** (ou monotone) par rapport à un paramètre si, lorsqu'on modifie ce paramètre dans un sens qui est censé rendre le système "plus facile" à ordonnancer (moins chargé, plus de temps, etc.), le test continue de dire que le système est ordonnançable.
> - **C-viable** : Si on diminue le temps d'exécution ($C_i$), le pire temps de réponse calculé ne doit pas augmenter.
> - **T-viable** : Si on augmente la période ($T_i$ - les tâches arrivent moins souvent), le pire temps de réponse calculé ne doit pas augmenter.
> - **r-viable** (ou O-viable) : Si on décale l'arrivée d'une tâche (on retarde son réveil $r_i$ par rapport au pire cas $t=0$), le pire temps de réponse calculé ne doit pas augmenter.
> *Note : Nous avons vu au TD 2 que la Simulation n'est pas toujours viable (Anomalies de Richard) lorsqu'il y a des ressources partagées. Qu'en est-il de la formule mathématique RTA ?*

---

## a) Une durée d'exécution ($C_i$) était moins longue ?

**Observation sur la RBF (Figure 3) :**
La RBF (la courbe rouge en escalier) représente la demande de calcul : $\sum \left\lceil \frac{t}{T_j} \right\rceil C_j$.
Si un $C_i$ diminue, la hauteur des "marches" de l'escalier rouge diminue. La courbe rouge globale sera donc **plus basse**.
Puisque la droite de traitement (verte) $y = t$ reste inchangée, elle croisera la courbe rouge (le point fixe) **plus tôt**.

**Conclusion :** La durée de la période d'activité (et donc le temps de réponse calculé) **diminue** (ou au pire, reste égale). 

---

## b) Une période ($T_i$) était plus longue que prévue ?

**Observation sur la RBF :**
Le terme $\left\lceil \frac{t}{T_i} \right\rceil$ représente le nombre d'activations d'une tâche.
Si on augmente $T_i$ (la tâche s'active moins souvent), les "sauts" (les nouvelles marches) de la courbe rouge s'espaceront davantage sur l'axe des abscisses (temps). La courbe rouge montera moins vite et sera donc **globalement plus basse** pour une fenêtre de temps donnée.
Là encore, la droite de traitement croisera l'escalier rouge **plus tôt**.

**Conclusion :** La durée de la période d'activité **diminue** (ou reste égale).

---

## c) Une date de réveil ($r_i$ ou $O_i$) était plus grande que 0 ?

**Observation mathématique :**
La formule RTA suppose que tout le monde démarre à $r_i = 0$ (l'instant critique parfait). Cela crée une immense marche verticale dès $t=0$ sur la RBF (tous les $C_j$ s'empilent).
Si une tâche a un $r_i > 0$ (départ différé), sa première marche n'arrivera pas à $t=0$, mais plus tard. 
L'escalier rouge démarrera donc plus bas, et la charge sera "étalée" dans le temps. La droite de traitement aura plus de facilité à rattraper le retard, et le point d'intersection se fera **plus tôt**.

**Conclusion :** La durée de la période d'activité (l'embouteillage) **diminue**.

---

## d) Conclusion sur la viabilité de la RTA

D'après les réponses a, b, et c :
- Améliorer un $C_i$ (le diminuer) ne fait jamais empirer le résultat mathématique de la RTA 👉 **La RTA est C-viable.**
- Améliorer un $T_i$ (l'augmenter) ne fait jamais empirer le résultat de la RTA 👉 **La RTA est T-viable.**
- Désynchroniser les tâches (retarder un $r_i$) ne fait jamais empirer le calcul de la RTA (qui de toute façon suppose toujours le pire alignement à 0) 👉 **La RTA est r-viable.**

**Bilan :** 
Contrairement à la simulation qui peut souffrir d'anomalies d'ordonnancement (par effet papillon dans des systèmes complexes), la formule RTA est une abstraction mathématique purement **monotone** (viable). Si la RTA valide un système, et que le constructeur décide de mettre un processeur légèrement plus rapide (diminution des $C_i$), on a la certitude absolue et immédiate que le système restera valide, sans avoir besoin de refaire le calcul ! C'est la grande force de la RTA.
