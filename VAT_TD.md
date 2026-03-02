# TD VAT flottant : Complexité algorithmique

## 1. Complexité d'un algorithme vs. d'un problème

### Question a : Quelle est la complexité de cet algorithme en fonction de n ?

**Algorithme étudié :**
```
Inclue (T : tableau de n entiers, E : entier)
-- Renvoie vrai ssi E ∈ T
Pour i de 1 à n
   Si T(i)=E retourner vrai
Retourner faux
```

**Réponse :**

La complexité de cet algorithme est **O(n)** (complexité linéaire).

---

## Analyse détaillée par cas

### 1. **Meilleur cas : Ω(1) - Complexité constante**

L'élément E est trouvé à la **première position** (i=1).

```
T = [5, 12, 8, 3, 17, 9, 21]    E = 5
     ↑
     Trouvé immédiatement !

Nombre de comparaisons : 1
```

### 2. **Pire cas : O(n) - Complexité linéaire**

Deux situations :
- L'élément E **n'est pas présent** dans le tableau
- L'élément E se trouve à la **dernière position**

```
Cas 1 - Élément absent :
T = [5, 12, 8, 3, 17, 9, 21]    E = 100
     ✗  ✗   ✗  ✗  ✗   ✗  ✗
     On doit vérifier tous les éléments !

Nombre de comparaisons : n = 7

Cas 2 - Dernière position :
T = [5, 12, 8, 3, 17, 9, 21]    E = 21
     ✗  ✗   ✗  ✗  ✗   ✗  ✓
     Trouvé seulement à la fin

Nombre de comparaisons : n = 7
```

### 3. **Cas moyen : Θ(n/2) = Θ(n)**

En supposant une distribution uniforme, l'élément se trouve **en moyenne au milieu**.

```
T = [5, 12, 8, 3, 17, 9, 21]    E = 3
     ✗  ✗   ✗  ✓
     Trouvé vers le milieu

Nombre moyen de comparaisons : n/2 ≈ 3.5
```

**Remarque importante :** En notation asymptotique, O(n/2) = O(n) car on ignore les constantes multiplicatives.

---

## Graphique comparatif

```
Nombre de
comparaisons
    │
  n │                          ────────────  Pire cas O(n)
    │                    ──────
    │              ──────
n/2 │        ──────                          Cas moyen Θ(n/2)
    │  ──────
    │ ─
  1 │ •                                      Meilleur cas Ω(1)
    └────────────────────────────────────────────────→
                                          Taille n

Légende : La courbe montre la croissance linéaire
```

---

## Justification mathématique

**Décompte des opérations élémentaires :**

1. **Initialisation de la boucle** : 1 opération (i ← 1)
2. **Test de continuation** : au maximum n+1 tests (i ≤ n ?)
3. **Incrémentation** : au maximum n incrémentations (i++)
4. **Comparaisons** : au maximum n comparaisons (T(i)=E ?)
5. **Retour** : 1 opération

**Total pire cas :** T(n) = 1 + (n+1) + n + n + 1 = 3n + 3 = **O(n)**

En notation Big-O, on garde uniquement le terme dominant : **O(n)**

---

## Complexités

| Type | Temporelle | Spatiale |
|------|------------|----------|
| Meilleur cas | **Ω(1)** | **O(1)** |
| Cas moyen | **Θ(n)** | **O(1)** |
| Pire cas | **O(n)** | **O(1)** |

**Complexité en espace :** O(1) - l'algorithme n'utilise qu'un nombre constant de variables supplémentaires (l'indice i et éventuellement une variable temporaire).

---

## Conclusion

Cet algorithme de **recherche linéaire** (ou séquentielle) :
- ✓ Est **simple** à implémenter
- ✓ Fonctionne sur **tout type de tableau** (trié ou non)
- ✗ Mais a une complexité **linéaire O(n)** qui peut être lente pour de grandes valeurs de n
- → Pour un tableau **trié**, on peut faire **beaucoup mieux** avec la recherche dichotomique O(log n) (voir question f)

### Question b : Vérifier que pour l'entrée 111x11, avec la tête sur le premier 1, on obtient bien 11111 avec la tête sur le dernier 1.

**Principe de la machine :** Cette machine de Turing effectue une addition en base 1 en remplaçant le 'x' séparateur par un '1', puis en éliminant le dernier '1' pour compenser.

**Trace détaillée de l'exécution :**

```
État | Ruban           | Explication
-----|-----------------|------------------------------------------
0    | [1]11x11        | Position initiale, tête sur premier 1
0    | 1[1]1x11        | Avance à droite en lisant les 1
0    | 11[1]x11        | Continue à avancer
0    | 111[x]11        | Atteint le séparateur x
1    | 111ε[1]1        | Remplace x par ε (blanc), avance à droite
2    | 111[ε]ε1        | Lit 1, écrit ε, recule à gauche
3    | 1111[ε]1        | Lit ε, écrit 1, avance à droite (décalage)
1    | 1111ε[1]        | Lit ε, reste ε, avance (prépare prochain cycle)
2    | 1111[ε]ε        | Lit 1, écrit ε, recule
3    | 11111[ε]        | Lit ε, écrit 1, avance
1    | 11111ε[ε]       | Atteint la fin (blanc de fin de ruban)
4    | 1111[1]ε        | Lit ε, reste ε, recule à gauche → État final
```

**Vérification :** 3 + 2 = 5 ✓
- Entrée : `111x11` (trois 1 + deux 1)
- Sortie : `11111` (cinq 1)
- Tête positionnée sur le dernier 1

**Complexité :** O(n₁ + n₂) où n₁ et n₂ sont les deux nombres à additionner.

### Question c : Qu'ajouter pour que la tête soit positionnée sur le premier 1 ?

**Objectif :** Modifier la machine pour que la tête finisse sur le premier 1 (à gauche) au lieu du dernier.

**Solution :** Ajouter un état 5 qui ramène la tête au début du résultat.

**Schéma modifié de l'automate :**

```text
                    1/1,R
              ┌──────────┐
              ▼          │
           ┌────┐     ┌────┐     ┌────┐
  Début──▶ │ 0  │────▶│ 1  │────▶│ 2  │
           └────┘ x/ε,R└────┘1/ε,L└────┘
                         │         │
                     ε/ε,R     ε/1,R
                         │         │
                         ▼         ▼
                      ┌────┐    ┌────┐
                      │ 4  │◀───│ 3  │
                      └────┘ε/ε,L└────┘
                         │ 1/1,L  ▲ ε/1,R
                         ▼         │
                      ┌────┐       │
                      │ 5  │───────┘
                      └────┘ε/ε,R
                         │
                         │ 1/1,L
                         ▼
                    ┌───────┐
                    │(( Fin ))│
                    └───────┘
```

**Transitions de l'état 5 (nouveau) :**
- État 5 : Lit '1', écrit '1', déplace à **Gauche** (retour au début)
- État 5 : Lit 'ε', écrit 'ε', déplace à **Droite** puis **Halt** (atteint le début)

**Trace avec l'état 5 :**
1. États 0→1→2→3 produisent `11111ε` avec tête sur le dernier 1
2. État 4→5 : Commence à reculer
3. État 5 boucle : `1111[1]ε` → `111[1]1ε` → `11[1]11ε` → `1[1]111ε` → `[1]1111ε`
4. État 5→Halt : Lit ε à gauche, avance d'un cran à droite, s'arrête sur `[1]1111`

### Question d : Que se passe-t-il si on a un symbole non reconnu en entrée ?

**Réponse :**

Si la machine de Turing lit un symbole pour lequel aucune transition n'est définie dans l'état courant, l'exécution s'arrête immédiatement dans un **état de blocage** (ou rejet).

**Exemples de symboles non reconnus :**
- Un '2' alors que seuls '1', 'x' et 'ε' sont définis
- Un caractère alphabétique 'a' ou 'b'
- Un symbole spécial comme '#' ou '@'

**Différence avec un arrêt normal :**

| **Arrêt normal (Halt)** | **Plantage (Blocage)** |
|-------------------------|------------------------|
| État final atteint      | État non-final         |
| Résultat accepté ✓      | Résultat rejeté ✗      |
| Comportement prévu      | Erreur d'exécution     |

**Conséquences :**
1. La machine **n'a pas de transition** définie pour ce couple (état, symbole)
2. L'exécution **s'interrompt brutalement**
3. Le résultat sur le ruban est considéré comme **invalide**
4. C'est équivalent à une **exception non gérée** en programmation

**Exemple concret :**
- Entrée : `112x11` (contient un '2' non reconnu)
- État 0, lit '1' → OK, avance
- État 0, lit '1' → OK, avance
- État 0, lit '2' → **PLANTAGE** (aucune transition définie pour (État 0, '2'))

**Analogie informatique :** C'est comme une instruction illégale en assembleur ou une exception `IllegalArgumentException` non catchée.

### Question e : Programme Incrémenter d'un entier décimal

**Objectif :** Incrémenter un entier écrit en base 10 (ex: 19 → 20, 99 → 100).

**Conditions initiales et finales :**
- **Entrée :** Tête sur le chiffre de poids faible (le plus à droite, unités)
- **Sortie :** Tête de nouveau sur le chiffre de poids faible du résultat

**Principe algorithmique :**
L'incrémentation en décimal suit la règle des retenues :
- Chiffre 0-8 : incrémenter directement, pas de retenue
- Chiffre 9 : devient 0, propager la retenue au chiffre suivant (à gauche)
- Cas particulier 999...9 → 1000...0 : nécessite d'ajouter un nouveau chiffre

**Schéma de l'automate (version améliorée) :**

```text
                             9 / 0, L
                          (retenue)
                         ┌─────────┐
                         │         │
                         ▼         │
    ┌────────────────────────────────────────────────┐
    │                    Inc                         │
    │          (État d'incrémentation)               │
    └────────────────────────────────────────────────┘
       │                                      │
       │ [0-8] / +1, R                       │ ε / 1, R
       │ (pas de retenue)          (débordement 999→1000)
       │                                      │
       ▼                                      ▼
    ┌────────────────────────────────────────────────┐
    │                    Ret                         │
    │         (État de retour à droite)              │◄─┐
    └────────────────────────────────────────────────┘  │
       │                                                │
       │ [0-9] / =, R                                   │
       │ (défilement vers la droite)                    │
       └────────────────────────────────────────────────┘
       │
       │ ε / ε, L
       ▼
   ┌───────┐
   │  Fin  │  (État final - tête sur dernier chiffre)
   └───────┘
```

**Table de transitions détaillée :**

| État | Symbole lu | Symbole écrit | Déplacement | Nouvel état | Signification |
|------|------------|---------------|-------------|-------------|---------------|
| Inc  | 0          | 1             | R           | Ret         | 0→1, terminé |
| Inc  | 1          | 2             | R           | Ret         | 1→2, terminé |
| Inc  | ...        | ...           | R           | Ret         | ... |
| Inc  | 8          | 9             | R           | Ret         | 8→9, terminé |
| Inc  | 9          | 0             | L           | Inc         | 9→0, retenue ! |
| Inc  | ε          | 1             | R           | Ret         | Débordement (ex: 99→100) |
| Ret  | 0-9        | 0-9 (inchangé)| R           | Ret         | Revient à droite |
| Ret  | ε          | ε             | L           | Fin         | Fin détectée, recule |

**Exemples d'exécution :**

1. **Cas simple : 47 → 48**
```
Ruban : 4[7]ε
Inc : lit 7, écrit 8, va à droite → 48[ε]
Ret : lit ε, va à gauche → 4[8]ε → FIN
Résultat : 48
```

2. **Cas avec retenue : 19 → 20**
```
Ruban : 1[9]ε
Inc : lit 9, écrit 0, va à gauche → [1]0ε
Inc : lit 1, écrit 2, va à droite → 2[0]ε
Ret : lit 0, va à droite → 20[ε]
Ret : lit ε, va à gauche → 2[0]ε → FIN
Résultat : 20
```

3. **Cas débordement : 99 → 100**
```
Ruban : 9[9]ε
Inc : lit 9, écrit 0, va à gauche → [9]0ε
Inc : lit 9, écrit 0, va à gauche → [ε]00ε
Inc : lit ε, écrit 1, va à droite → 1[0]0ε
Ret : lit 0, va à droite → 10[0]ε
Ret : lit 0, va à droite → 100[ε]
Ret : lit ε, va à gauche → 10[0]ε → FIN
Résultat : 100
```

**Complexité :**
- **Meilleur cas :** O(1) - chiffre 0-8, pas de retenue
- **Pire cas :** O(n) - tous les chiffres sont 9 (ex: 9999→10000), n = nombre de chiffres

### Question f : Complexité sur un tableau trié

**Contexte :** Si le tableau est trié par ordre croissant, peut-on faire mieux que O(n) ?

**Réponse : OUI !** On peut utiliser un algorithme de **recherche dichotomique** (binary search).

**Algorithme de recherche dichotomique :**

```
RechercheDichotomique(T : tableau trié de n entiers, E : entier)
-- Renvoie vrai ssi E ∈ T
debut ← 1
fin ← n
Tant que debut ≤ fin faire
    milieu ← ⌊(debut + fin) / 2⌋
    Si T[milieu] = E alors
        Retourner vrai
    Sinon si T[milieu] < E alors
        debut ← milieu + 1  // Chercher dans la moitié droite
    Sinon
        fin ← milieu - 1    // Chercher dans la moitié gauche
    Fin Si
Fin Tant que
Retourner faux
```

**Complexité : O(log₂ n)**

**Analyse détaillée :**

| Itération | Taille de l'espace de recherche | Opérations |
|-----------|----------------------------------|------------|
| 0         | n                                | 1 comparaison |
| 1         | n/2                              | 1 comparaison |
| 2         | n/4                              | 1 comparaison |
| 3         | n/8                              | 1 comparaison |
| ...       | ...                              | ... |
| k         | n/2^k = 1                        | 1 comparaison |

On arrête quand n/2^k = 1, donc 2^k = n, d'où **k = log₂(n)**

**Exemple concret avec n=16 éléments :**
- Recherche linéaire : jusqu'à **16 comparaisons**
- Recherche dichotomique : au plus **4 comparaisons** (log₂(16) = 4)

**Visualisation de la recherche de 7 dans [1, 3, 5, 7, 9, 11, 13, 15] :**

```
Étape 1: [1, 3, 5, 7 | 9, 11, 13, 15]  milieu=9  → 7 < 9, aller à gauche
Étape 2: [1, 3 | 5, 7]                  milieu=5  → 7 > 5, aller à droite
Étape 3: [5 | 7]                        milieu=7  → 7 = 7, TROUVÉ ! ✓
```

**Comparaison des complexités :**

| Taille n | Linéaire O(n) | Dichotomique O(log n) | Gain |
|----------|---------------|----------------------|------|
| 10       | 10            | ~3                   | 3× |
| 100      | 100           | ~7                   | 14× |
| 1 000    | 1 000         | ~10                  | 100× |
| 1 000 000| 1 000 000     | ~20                  | 50 000× |

**Conclusion :** La recherche dichotomique est **exponentiellement plus rapide** qu'un parcours linéaire pour de grandes valeurs de n, **mais nécessite que le tableau soit trié**.

### Question g : Algorithme vs Problème

**Question :** L'algorithme `Inclue` fonctionne-t-il sur un tableau trié ? Quelle est sa complexité ? Que peut-on dire par rapport à la complexité du problème ?

**Réponse :**

**OUI**, l'algorithme `Inclue` (recherche linéaire) fonctionne toujours sur un tableau trié, mais sa complexité reste **O(n)** car il **ne profite pas de la structure** (l'ordre) des données. Il parcourt les éléments un par un, comme si le tableau était non trié.

**Distinction fondamentale : Algorithme vs Problème**

Cette question illustre une distinction cruciale en informatique théorique :

| Concept | Définition | Exemple |
|---------|------------|---------|
| **Complexité du PROBLÈME** | La difficulté **intrinsèque** du problème, mesurée par la complexité du **meilleur algorithme possible** | Chercher dans un tableau trié : **O(log n)** |
| **Complexité d'un ALGORITHME** | La performance d'une **solution particulière** à ce problème | Algorithme `Inclue` : **O(n)** |

**Analyse du cas présent :**

1. **Le problème :** "Rechercher un élément dans un tableau trié de taille n"
   - Complexité du problème : **O(log n)** (borne inférieure prouvée)
   - C'est le **minimum théorique** qu'on peut atteindre

2. **L'algorithme `Inclue` :**
   - Complexité : **O(n)**
   - Fonctionne correctement ✓
   - Mais est **sous-optimal** car O(n) > O(log n)

**Schéma conceptuel :**

```
                    Complexité
                        ↑
                        │
                   O(n) ├─────  Algorithme Inclue (sous-optimal)
                        │         │
                        │         │  Écart de performance !
                        │         │
              O(log n)  ├─────  Complexité du problème (optimal)
                        │         Recherche dichotomique
                        │
                        └────────────────────────────→
                                                    Taille n
```

**Pourquoi cet écart ?**

L'algorithme `Inclue` **ignore l'information** fournie par le tri :
- Il parcourt : `T[1], T[2], T[3], ..., T[n]`
- Peu importe si `T[1] < T[2] < T[3] < ... < T[n]` (trié) ou non
- Il n'utilise **jamais** le fait que le tableau est ordonné

La recherche dichotomique, elle, **exploite** cette information :
- Elle compare avec l'élément du milieu
- Elle élimine la moitié des possibilités à chaque étape
- Elle utilise la propriété d'ordre : si `E < T[milieu]`, alors `E` ne peut pas être à droite

**Analogie pédagogique :**

Imaginez chercher le mot "Python" dans un dictionnaire :
- **Méthode Inclue** : lire chaque mot depuis la page 1 → lent ! O(n)
- **Méthode dichotomique** : ouvrir au milieu, voir si c'est avant/après, ajuster → rapide ! O(log n)

**Conclusion importante :**

> **Un même problème peut avoir plusieurs algorithmes de complexités différentes.**
>
> La complexité du **problème** représente la **borne inférieure** : on ne peut pas faire mieux.
>
> Un algorithme est **optimal** si sa complexité égale celle du problème.

**Classification :**
- ✓ `Inclue` est **correct** (donne toujours la bonne réponse)
- ✗ `Inclue` est **sous-optimal** pour les tableaux triés (O(n) au lieu de O(log n))
- ✓ Recherche dichotomique est **optimale** pour les tableaux triés (O(log n))

**Remarque finale :** Pour un tableau **non trié**, `Inclue` est optimal car la complexité du problème "chercher dans un tableau non trié" est aussi O(n). On ne peut pas faire mieux que regarder tous les éléments dans le pire cas.

---

## 📊 Résumé visuel des questions a-g

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TD COMPLEXITÉ ALGORITHMIQUE                      │
│                   Machines de Turing & Analyse                      │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│ Question a) Complexité de l'algorithme Inclue                    │
├───────────────────────────────────────────────────────────────────┤
│  Algorithme : Recherche linéaire/séquentielle                     │
│  Complexité : O(n) linéaire                                       │
│  • Meilleur cas : Ω(1)  - élément en première position           │
│  • Cas moyen  : Θ(n/2)  - élément au milieu                      │
│  • Pire cas   : O(n)    - élément absent ou en dernière position │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│ Question b) Machine de Turing : Addition en base 1               │
├───────────────────────────────────────────────────────────────────┤
│  Entrée    : 111x11  (3 + 2 en base unaire)                      │
│  Sortie    : 11111   (5 en base unaire)                          │
│  Mécanisme : Remplace 'x' par '1', décale les symboles          │
│  Résultat  : ✓ Vérifié - 3 + 2 = 5                              │
│  Complexité: O(n₁ + n₂)                                          │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│ Question c) Positionner la tête sur le premier 1                 │
├───────────────────────────────────────────────────────────────────┤
│  Solution : Ajouter un état 5 de retour                          │
│  • État 5 : boucle 1/1,L (recule jusqu'au début)                │
│  • Détecte ε à gauche → avance d'un cran → FIN                  │
│  Résultat : Tête sur le premier 1 au lieu du dernier            │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│ Question d) Symbole non reconnu en entrée                        │
├───────────────────────────────────────────────────────────────────┤
│  Conséquence : PLANTAGE (blocage, rejet)                         │
│  • Aucune transition définie pour (état, symbole)               │
│  • Arrêt dans un état non-final                                 │
│  • Résultat invalide                                            │
│  Analogie : Exception non gérée en programmation                │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│ Question e) Incrémenter un entier décimal                        │
├───────────────────────────────────────────────────────────────────┤
│  États :                                                          │
│    • Inc : Incrémentation avec gestion des retenues             │
│      - [0-8] → +1, pas de retenue                               │
│      - [9]   → 0, retenue (recule à gauche)                     │
│      - [ε]   → 1, débordement (99→100)                          │
│    • Ret : Retour à la position finale (poids faible)           │
│  Exemples : 47→48, 19→20, 99→100                                │
│  Complexité : O(1) meilleur cas, O(n) pire cas (9999→10000)    │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│ Question f) Recherche dans un tableau trié                       │
├───────────────────────────────────────────────────────────────────┤
│  Algorithme optimal : Recherche dichotomique (binary search)     │
│  Complexité : O(log₂ n) - EXPONENTIELLE plus rapide !          │
│                                                                   │
│  Comparaison avec recherche linéaire :                           │
│    n = 1 000 000                                                 │
│    • Linéaire     : 1 000 000 comparaisons                      │
│    • Dichotomique : ~20 comparaisons                            │
│    • Gain         : 50 000× plus rapide !                       │
│                                                                   │
│  Principe : Diviser l'espace de recherche par 2 à chaque étape │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│ Question g) Algorithme vs Problème                               │
├───────────────────────────────────────────────────────────────────┤
│  Distinction FONDAMENTALE :                                       │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ COMPLEXITÉ DU PROBLÈME                                      │ │
│  │ = Difficulté intrinsèque (borne inférieure)                │ │
│  │ = Meilleur algorithme POSSIBLE                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ COMPLEXITÉ D'UN ALGORITHME                                 │ │
│  │ = Performance d'une solution particulière                  │ │
│  │ = Peut être sous-optimale                                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Exemple concret :                                               │
│    • Problème  : Chercher dans tableau trié → O(log n)         │
│    • Algo Inclue : O(n) → SOUS-OPTIMAL ✗                       │
│    • Algo Dicho  : O(log n) → OPTIMAL ✓                        │
│                                                                   │
│  Analogie : Chercher dans un dictionnaire                       │
│    • Méthode linéaire : lire page par page (lent)              │
│    • Méthode dicho    : ouvrir au milieu (rapide)              │
└───────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     CONCEPTS CLÉS À RETENIR                     │
├─────────────────────────────────────────────────────────────────┤
│ 1. Machine de Turing = modèle théorique de calcul             │
│ 2. Complexité temporelle ≠ Complexité spatiale                │
│ 3. Meilleur/Moyen/Pire cas : analyser tous les scénarios      │
│ 4. Big-O : borne supérieure (pire cas)                        │
│ 5. Omega Ω : borne inférieure (meilleur cas)                  │
│ 6. Theta Θ : borne exacte (cas moyen)                         │
│ 7. Structure des données ⟹ Algorithmes optimaux différents   │
│ 8. Exploiter l'information (ex: ordre du tri) = clé !         │
│ 9. Complexité du problème = objectif à atteindre              │
│10. Algorithme sous-optimal ≠ algorithme incorrect             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               TABLEAU RÉCAPITULATIF DES COMPLEXITÉS             │
├───────────────────┬─────────────────┬───────────────────────────┤
│  Algorithme       │  Complexité     │  Contexte                 │
├───────────────────┼─────────────────┼───────────────────────────┤
│  Inclue           │  O(n)           │  Tableau non trié         │
│  (linéaire)       │                 │  Optimal dans ce cas      │
├───────────────────┼─────────────────┼───────────────────────────┤
│  Inclue           │  O(n)           │  Tableau trié             │
│  (linéaire)       │                 │  SOUS-OPTIMAL !           │
├───────────────────┼─────────────────┼───────────────────────────┤
│  Dichotomique     │  O(log n)       │  Tableau trié             │
│  (binary search)  │                 │  OPTIMAL ✓                │
├───────────────────┼─────────────────┼───────────────────────────┤
|  Addition MT      │  O(n₁ + n₂)     │  Base 1 (unaire)          │
│  base 1           │                 │                           │
├───────────────────┼─────────────────┼───────────────────────────┤
│  Incrémentation   │  O(1) → O(n)    │  Base 10 (décimal)        │
│  décimale MT      │                 │  Selon nombre de retenues │
└───────────────────┴─────────────────┴───────────────────────────┘
```

---

# TD VAT 3 : Optimalité en FTP

La simulation, pour des systèmes de tâches indépendantes :
- Est une **CNS** (Condition Nécessaire et Suffisante) d'ordonnançabilité pour les systèmes de tâches périodiques ou sporadiques en monoprocesseur ;
- Est une **CNS** d'ordonnançabilité pour les systèmes de tâches périodiques en multiprocesseur.

Cependant, la simulation possède deux inconvénients majeurs :
- Dès lors qu'il existe des facteurs pratiques (exclusions mutuelles, parties non préemptibles, suspension, contraintes de précédence non consistantes avec les priorités), la simulation perd toute propriété de viabilité. Elle devient une condition suffisante de non-ordonnançabilité.
- La simulation possède une complexité exponentielle : PPCM(1, 2, ...n+1) ≥ 2ⁿ.

## 1. Tests d'ordonnançabilité polynomiaux

On sait que la complexité du problème d'ordonnançabilité est **Co-NP-difficile** au sens fort avec des dates de réveil, et le calcul du temps de réponse est **NP-difficile** au sens faible même avec réveil simultané. Les tests polynomiaux sont donc des conditions suffisantes (heuristiques conservatrices).

### Rate Monotonic (RM)
Priorités inversement proportionnelles à la période (Ti). RM est optimale pour les priorités fixes si :
1. Tâches indépendantes et préemptibles.
2. Monoprocesseur.
3. Instant critique existant (réveil simultané possible).
4. Périodiques ou sporadiques.
5. Échéances sur requête (Di = Ti).

**Borne de Liu & Layland (1973) :**
Un système de n tâches est ordonnancable par RM si :
$$U = \sum_{i=1}^{n} \frac{C_i}{T_i} \leq n(2^{1/n} - 1)$$
$\lim_{n \to \infty} n(2^{1/n} - 1) = \ln 2 \approx 0,69$.

**Borne hyperbolique (2003) :**
Plus puissante que L&L :
$$\prod_{i=1}^{n} (U_i + 1) \leq 2$$

---

## 2. Exercices

### Exercice 1
Système périodique, monoprocesseur, priorités fixes :
| Tâche | ri | Ci | Di | Ti |
|---|---|---|---|---|
| τ1 | 0 | 8 | 30 | 30 |
| τ2 | 0 | 6 | 20 | 20 |
| τ3 | 0 | 4 | 15 | 15 |

**a) Utilisation processeur :**
$U = 8/30 + 6/20 + 4/15 = 16/60 + 18/60 + 16/60 = 50/60 \approx 0,833$.
$U < 1$, donc le système n'est pas trivialement non-ordonnançable.

**b) RM est-il optimal ?**
Oui, car toutes les conditions (indépendance, préemptibilité, Di=Ti, monoprocesseur) sont remplies.

**c) Test polynomial :**
L&L : $3(2^{1/3}-1) \approx 0,779$. $0,833 > 0,779$ → Le test L&L ne conclut pas.
Hyperbolique : $(8/30+1)(6/20+1)(4/15+1) \approx 1,26 \times 1,3 \times 1,26 \approx 2,08 > 2$ → Ne conclut pas non plus.

---

### Exercice 2
Système de tâches différées :
| Tâche | ri | Ci | Di | Ti |
|---|---|---|---|---|
| τ1 | 8 | 8,05 | 30 | 30 |
| τ2 | 4 | 4,5 | 20 | 20 |
| τ3 | 0 | 4,3 | 15 | 15 |

**a) Charge U :**
$U = 8,05/30 + 4,5/20 + 4,3/15 \approx 0,268 + 0,225 + 0,286 = 0,779$.
$U < 1$, possiblement ordonnançable.

**b) RM optimal ?**
Non, car les tâches sont différées (pas d'instant critique garanti par les ri).

---

### Exercice 3
Tâches sporadiques, échéances contraintes (Di ≤ Ti) :
| Tâche | Ci | Di | Ti |
|---|---|---|---|
| τ1 | 4 | 16 | 16 |
| τ2 | 3 | 7 | 8 |
| τ3 | 4 | 6 | 12 |

**a) Affectation optimale :**
**Deadline Monotonic (DM)** est optimale ici (priorités inversement proportionnelles à Di).
Priorités : P(τ3) > P(τ2) > P(τ1).

---

## 3. Algorithme d'Audsley (OPA)

Utilisé quand RM/DM ne sont plus optimaux (ex: Di > Ti, ou facteurs pratiques).
Complexité : **O(n²)** tests d'ordonnançabilité de tâches.

**Conditions d'application :**
1. L'ordonnançabilité d'une tâche ne dépend que de l'ensemble des tâches plus prioritaires (pas de leur ordre).
2. L'ordonnançabilité d'une tâche ne dépend que de l'ensemble des tâches moins prioritaires (pas de leur ordre).
3. Propriété de monotonie par rapport à la priorité.

**Exercice 4 :**
| Tâche | Ci | Di | Ti |
|---|---|---|---|
| τ1 | 4 | 16 | 16 |
| τ2 | 2 | 9 | 8 |
| τ3 | 5 | 13 | 12 |

**a) Complexité OPA :** $n(n+1)/2$ tests, donc **O(n²)**.
**b) Pour 25 tâches :** $25 \times 26 / 2 = 325$ tests maximum.

**c) Non-préemptibilité :**
Si les tâches sont non-préemptibles, la condition 1 d'Audsley n'est plus forcément respectée (l'effet de blocage d'une tâche moins prioritaire dépend de la plus longue d'entre elles).

**d) Système sporadique :**
| Tâche | Ci | Di | Ti |
|---|---|---|---|
| τ1 | 4 | 16 | 16 |
| τ2 | 2 | 9 | 8 |
| τ3 | 5 | 13 | 12 |

Dans ce cadre (échéances contraintes Di ≤ Ti, indépendantes, préemptibles), DM est optimal. OPA s'applique également.
Simulation pour valider : Oui, car les tâches sont indépendantes et monoprocesseur (instant critique = pire cas).


---

## 🎯 Points essentiels pour l'examen

1. **Savoir analyser la complexité** d'un algorithme simple (compter les opérations)
2. **Distinguer meilleur/moyen/pire cas** et utiliser les bonnes notations (Ω, Θ, O)
3. **Comprendre les Machines de Turing** : transitions, états, ruban
4. **Connaître la recherche dichotomique** et son principe de division
5. **Comprendre la différence** entre complexité d'un problème vs d'un algorithme
6. **Savoir qu'exploiter la structure** des données permet d'optimiser

**Conseil :** Pour chaque algorithme, toujours se demander :
- Quelle est la complexité dans le pire cas ?
- Puis-je faire mieux en exploitant une propriété des données ?
- Cet algorithme est-il optimal pour ce problème ?

---

## 2. Classes de complexité des problèmes

### Contexte : Le problème 3SAT

**Définition du problème 3SAT :**
> Soit une formule booléenne constituée d'une **conjonction de disjonctions de 3 littéraux**.
>
> **Question :** Existe-t-il une valuation des variables booléennes telle que la formule est vraie ?

**Exemple de formule 3SAT :**
```
(a ∨ ¬b ∨ c) ∧ (¬a ∨ ¬b ∨ c)
```

Où :
- `∨` = OU logique (disjonction)
- `∧` = ET logique (conjonction)
- `¬` = NON logique (négation)
- Un **littéral** = une variable ou sa négation (a, ¬a, b, ¬b, c, ¬c)
- Une **clause** = disjonction de 3 littéraux (ex: `a ∨ ¬b ∨ c`)

---

### Question a : Arbre des valuations pour (a ∨ ¬b ∨ c) ∧ (¬a ∨ ¬b ∨ c)

**Objectif :** Construire un arbre binaire représentant toutes les valuations possibles des variables.

**Structure de l'arbre :**
- **Niveau 1** : variable `a` (vrai ou faux)
- **Niveau 2** : variable `b` (vrai ou faux)
- **Niveau 3** : variable `c` (vrai ou faux)
- **Feuilles** : évaluation de la formule pour cette valuation

**Arbre complet des valuations :**

```
                              Racine
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
              a=Vrai                          a=Faux
                 │                               │
         ┌───────┴───────┐             ┌───────┴───────┐
         │               │             │               │
      b=Vrai          b=Faux        b=Vrai          b=Faux
         │               │             │               │
     ┌───┴───┐       ┌───┴───┐     ┌───┴───┐       ┌───┴───┐
     │       │       │       │     │       │       │       │
  c=V    c=F     c=V    c=F   c=V    c=F     c=V    c=F
   │      │       │      │     │      │       │      │
 (VVV)  (VVF)   (VFV)  (VFF) (FVV)  (FVF)   (FFV)  (FFF)
```

**Évaluation de la formule pour chaque feuille :**

| Valuation | a | b | c | (a ∨ ¬b ∨ c) | (¬a ∨ ¬b ∨ c) | Formule complète |
|-----------|---|---|---|--------------|---------------|------------------|
| 1         | V | V | V | V ∨ F ∨ V = **V** | F ∨ F ∨ V = **V** | V ∧ V = **V** ✓ |
| 2         | V | V | F | V ∨ F ∨ F = **V** | F ∨ F ∨ F = **F** | V ∧ F = **F** ✗ |
| 3         | V | F | V | V ∨ V ∨ V = **V** | F ∨ V ∨ V = **V** | V ∧ V = **V** ✓ |
| 4         | V | F | F | V ∨ V ∨ F = **V** | F ∨ V ∨ F = **V** | V ∧ V = **V** ✓ |
| 5         | F | V | V | F ∨ F ∨ V = **V** | V ∨ F ∨ V = **V** | V ∧ V = **V** ✓ |
| 6         | F | V | F | F ∨ F ∨ F = **F** | V ∨ F ∨ F = **V** | F ∧ V = **F** ✗ |
| 7         | F | F | V | F ∨ V ∨ V = **V** | V ∨ V ∨ V = **V** | V ∧ V = **V** ✓ |
| 8         | F | F | F | F ∨ V ∨ F = **V** | V ∨ V ∨ F = **V** | V ∧ V = **V** ✓ |

**Résultat :** La formule est **SATISFIABLE** ✓

**Valuations qui satisfont la formule :** 6 sur 8
- ✓ (V, V, V), (V, F, V), (V, F, F), (F, V, V), (F, F, V), (F, F, F)

**Schéma visuel simplifié avec résultats :**

```
                        Racine
                           │
            ┌──────────────┴──────────────┐
            │                             │
          a=V                           a=F
            │                             │
      ┌─────┴─────┐               ┌─────┴─────┐
      │           │               │           │
    b=V         b=F             b=V         b=F
      │           │               │           │
   ┌──┴──┐     ┌──┴──┐        ┌──┴──┐     ┌──┴──┐
   │     │     │     │        │     │     │     │
  c=V   c=F   c=V   c=F      c=V   c=F   c=V   c=F
   │     │     │     │        │     │     │     │
  ✓V    ✗F    ✓V    ✓V       ✓V    ✗F    ✓V    ✓V
 VVV   VVF   VFV   VFF      FVV   FVF   FFV   FFF
```

---

### Question b : Taille d'un arbre pour n variables

**Réponse : 2^n feuilles (valuations possibles)**

**Analyse :**

Pour une formule avec **n variables** booléennes :
- Chaque variable peut prendre **2 valeurs** : Vrai ou Faux
- Le nombre total de valuations possibles = **2 × 2 × 2 × ... × 2** (n fois)

**Formule : Nombre de feuilles = 2^n**

**Structure de l'arbre :**
- **Profondeur** : n niveaux
- **Nombre de nœuds internes** : 2^0 + 2^1 + 2^2 + ... + 2^(n-1) = 2^n - 1
- **Nombre de feuilles** : 2^n
- **Nombre total de nœuds** : (2^n - 1) + 2^n = **2^(n+1) - 1**

**Exemples concrets :**

| Nombre de variables n | Nombre de feuilles 2^n | Taille totale 2^(n+1)-1 |
|-----------------------|------------------------|-------------------------|
| 1                     | 2                      | 3                       |
| 2                     | 4                      | 7                       |
| 3                     | 8                      | 15                      |
| 4                     | 16                     | 31                      |
| 10                    | 1 024                  | 2 047                   |
| 20                    | 1 048 576              | 2 097 151               |
| 100                   | 1.27 × 10^30           | 2.54 × 10^30            |

**Complexité :** **Exponentielle O(2^n)**

**Conséquence pratique :**
Avec seulement 100 variables, on aurait plus de **10^30 feuilles** à explorer ! C'est impossible à calculer en temps raisonnable, même avec les ordinateurs les plus puissants.

---

### Question c : Complexité de vérification si la réponse est OUI

**Contexte :** On nous donne une formule 3SAT et quelqu'un nous dit : "OUI, la formule est satisfiable avec la valuation suivante : a=Vrai, b=Faux, c=Vrai".

**Question :** Quelle est la complexité pour **vérifier** que cette valuation satisfait bien la formule ?

**Réponse : O(m) où m = nombre de clauses (linéaire)**

**Algorithme de vérification :**

```
VérifierSolution(formule, valuation)
-- formule : ensemble de m clauses
-- valuation : affectation de valeurs aux variables
Pour chaque clause de la formule faire
    valeur_clause ← Évaluer(clause, valuation)
    Si valeur_clause = Faux alors
        Retourner Faux  // Au moins une clause est fausse
    Fin Si
Fin Pour
Retourner Vrai  // Toutes les clauses sont vraies
```

**Analyse de complexité :**

1. **Pour chaque clause** (m clauses au total) :
   - Évaluer la disjonction de 3 littéraux
   - Chaque littéral : 1 lecture de variable + éventuellement 1 négation = O(1)
   - Évaluer la disjonction : 2 OU logiques = O(1)
   - **Total par clause : O(1)**

2. **Pour toute la formule :**
   - m clauses × O(1) par clause = **O(m)**

**Exemple concret :**

```
Formule : (a ∨ ¬b ∨ c) ∧ (¬a ∨ ¬b ∨ c)
Valuation proposée : a=V, b=V, c=V

Vérification :
1. Clause 1 : (V ∨ ¬V ∨ V) = (V ∨ F ∨ V) = V ✓
2. Clause 2 : (¬V ∨ ¬V ∨ V) = (F ∨ F ∨ V) = V ✓
Résultat : Les 2 clauses sont vraies → ACCEPTÉ

Opérations : 2 clauses vérifiées = O(m) = O(2)
```

**Conclusion importante :**

> **Si quelqu'un nous donne une valuation candidate, on peut vérifier TRÈS RAPIDEMENT (en temps polynomial) qu'elle satisfait la formule.**
>
> C'est la définition d'un problème **NP** :
> - Difficile à résoudre (trouver une solution = exponentiel)
> - Facile à vérifier (vérifier une solution donnée = polynomial)

**Certificat :** La valuation proposée est appelée un "certificat" ou "témoin" de satisfiabilité.

---

### Question d : Complexité de vérification si la réponse est NON

**Contexte :** On nous dit : "NON, la formule n'est PAS satisfiable" (c'est une contradiction).

**Question :** Quelle est la complexité pour **vérifier** que la formule est bien insatisfiable ?

**Réponse : O(2^n) - Exponentielle (il faut vérifier TOUTES les valuations)**

**Problème fondamental :**

Pour prouver qu'une formule est insatisfiable, on doit montrer qu'**AUCUNE** des 2^n valuations possibles ne la satisfait.

**Algorithme de vérification :**

```
VérifierInsatisfiabilité(formule, n variables)
Pour chaque valuation possible (2^n valuations) faire
    Si Évaluer(formule, valuation) = Vrai alors
        Retourner Faux  // Contre-exemple trouvé !
    Fin Si
Fin Pour
Retourner Vrai  // Aucune valuation ne satisfait → insatisfiable
```

**Analyse de complexité :**

1. **Nombre de valuations à tester** : 2^n
2. **Temps par valuation** : O(m) (m clauses)
3. **Temps total : O(m × 2^n) = O(2^n)** (car m est polynomial en n)

**Comparaison OUI vs NON :**

| Réponse | Certificat | Vérification | Complexité |
|---------|------------|--------------|------------|
| **OUI** (SAT) | Une valuation qui satisfait | Évaluer la formule avec cette valuation | **O(m)** - Polynomial ✓ |
| **NON** (UNSAT) | ??? Aucun certificat simple | Tester TOUTES les valuations | **O(2^n)** - Exponentiel ✗ |

**Exemple concret :**

```
Formule insatisfiable : (a ∨ b) ∧ (¬a ∨ b) ∧ (a ∨ ¬b) ∧ (¬a ∨ ¬b)
Variables : a, b (n=2)

Pour prouver l'insatisfiabilité, on doit tester les 2^2 = 4 valuations :
1. a=V, b=V : (V∨V) ∧ (F∨V) ∧ (V∨F) ∧ (F∨F) = V ∧ V ∧ V ∧ F = F ✗
2. a=V, b=F : (V∨F) ∧ (F∨F) ∧ (V∨V) ∧ (F∨V) = V ∧ F ∧ V ∧ V = F ✗
3. a=F, b=V : (F∨V) ∧ (V∨V) ∧ (F∨F) ∧ (V∨F) = V ∧ V ∧ F ∧ V = F ✗
4. a=F, b=F : (F∨F) ∧ (V∨F) ∧ (F∨V) ∧ (V∨V) = F ∧ V ∧ V ∧ V = F ✗

Aucune valuation ne satisfait → La formule est INSATISFIABLE
Mais on a dû tester TOUTES les 4 valuations !
```

**Asymétrie fondamentale (problème Co-NP) :**

- **Prouver SAT (OUI)** : facile - un seul exemple suffit ✓
- **Prouver UNSAT (NON)** : difficile - il faut tester tous les cas ✗

C'est pourquoi 3SAT est dans **NP** mais vérifier l'insatisfiabilité est dans **Co-NP**.

**Conséquence pratique :**

Avec 100 variables :
- Dire "OUI" et le prouver : quelques millisecondes
- Dire "NON" et le prouver : 2^100 ≈ 10^30 tests → **impossible** !

---

## 📊 Résumé : Classes de complexité

```
┌──────────────────────────────────────────────────────────────────┐
│             PROBLÈME 3SAT ET CLASSES DE COMPLEXITÉ               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Question a) Arbre des valuations pour 3 variables             │
│    → 2³ = 8 feuilles (8 valuations possibles)                  │
│    → 6 valuations satisfont la formule exemple                 │
│                                                                  │
│  Question b) Taille de l'arbre pour n variables                │
│    → Nombre de feuilles : 2ⁿ (exponentiel)                     │
│    → Pour n=100 : 10³⁰ valuations (impossible à énumérer)      │
│                                                                  │
│  Question c) Vérifier la réponse OUI (SAT)                     │
│    → Complexité : O(m) où m = nombre de clauses               │
│    → Polynomial ! Facile à vérifier                            │
│    → C'est la définition de NP                                 │
│                                                                  │
│  Question d) Vérifier la réponse NON (UNSAT)                   │
│    → Complexité : O(2ⁿ) - Exponentiel                          │
│    → Il faut tester TOUTES les valuations                      │
│    → Définit la classe Co-NP                                   │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                    ASYMÉTRIE NP vs Co-NP                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Problème NP (3SAT) :                                           │
│    • Réponse OUI → Certificat facile (une valuation)           │
│    • Vérification en temps polynomial O(m)                      │
│                                                                  │
│  Problème Co-NP (TAUTOLOGIE, UNSAT) :                          │
│    • Réponse NON → Pas de certificat court                     │
│    • Vérification en temps exponentiel O(2ⁿ)                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Point clé :** Cette asymétrie entre prouver OUI et prouver NON est au cœur de la théorie de la complexité et de la conjecture P≠NP.

---

### Question e : Le problème CONTRADICTION est-il NP ou Co-NP ?

**Définition du problème CONTRADICTION :**
> Étant donnée une formule booléenne, renvoie OUI si et seulement si la formule est une **contradiction** (insatisfiable, toujours fausse).

**Réponse : Le problème CONTRADICTION est dans la classe Co-NP**

**Analyse détaillée :**

**Qu'est-ce qu'une contradiction ?**
Une formule est une **contradiction** si elle est **fausse pour toutes les valuations possibles**.

**Exemple de contradiction :**
```
(a ∨ b) ∧ (¬a ∨ b) ∧ (a ∨ ¬b) ∧ (¬a ∨ ¬b)
```

Peu importe les valeurs de a et b, cette formule est toujours FAUSSE.

**Pourquoi Co-NP ?**

| Question | Certificat | Vérification |
|----------|------------|--------------|
| **"OUI, c'est une contradiction"** | ??? Aucun certificat court | Il faut tester TOUTES les 2^n valuations pour prouver qu'aucune ne satisfait la formule → **O(2^n)** |
| **"NON, ce n'est PAS une contradiction"** | Une valuation qui satisfait la formule | Évaluer la formule avec cette valuation → **O(m)** polynomial ✓ |

**Caractéristiques Co-NP :**
- **Réponse NON** : facile à vérifier avec un certificat (une valuation satisfaisante)
- **Réponse OUI** : difficile à vérifier (pas de certificat polynomial)

**Relation avec 3SAT :**
```
CONTRADICTION = complémentaire de SAT
```

- **SAT** (NP) : "Existe-t-il une valuation qui satisfait la formule ?"
  - OUI → certificat facile (la valuation)

- **CONTRADICTION** (Co-NP) : "La formule est-elle fausse pour toutes les valuations ?"
  - OUI → pas de certificat facile
  - NON → certificat facile (une valuation qui rend la formule vraie)

**Exemple concret :**

```
Formule : (a ∨ b) ∧ (¬a ∨ b) ∧ (a ∨ ¬b) ∧ (¬a ∨ ¬b)

Pour prouver que c'est une CONTRADICTION (réponse OUI) :
- Tester a=V, b=V : F ✗
- Tester a=V, b=F : F ✗
- Tester a=F, b=V : F ✗
- Tester a=F, b=F : F ✗
→ Toutes fausses → C'est une CONTRADICTION ✓

Complexité : O(2^n) - Exponentiel !
```

**Schéma conceptuel :**

```
┌────────────────────────────────────────────────┐
│            Classes de complexité               │
├────────────────────────────────────────────────┤
│                                                │
│  NP :                                          │
│    SAT          → "∃ valuation vraie ?"        │
│                   OUI = facile à vérifier      │
│                                                │
│  Co-NP :                                       │
│    CONTRADICTION → "∀ valuations fausses ?"    │
│                    OUI = difficile à vérifier  │
│                    NON = facile à vérifier     │
│                                                │
└────────────────────────────────────────────────┘
```

**Conclusion :** CONTRADICTION ∈ **Co-NP** car c'est le complémentaire de SAT.

---

### Question f : Qu'en est-il du problème TAUTOLOGIE ?

**Définition du problème TAUTOLOGIE :**
> Étant donnée une formule booléenne, renvoie OUI si et seulement si la formule est une **tautologie** (toujours vraie pour toutes les valuations).

**Réponse : Le problème TAUTOLOGIE est dans la classe Co-NP**

**Analyse détaillée :**

**Qu'est-ce qu'une tautologie ?**
Une formule est une **tautologie** si elle est **vraie pour toutes les valuations possibles**.

**Exemples de tautologies :**

1. **Tautologie classique :**
```
a ∨ ¬a
```
Toujours vrai : si a=V alors (V ∨ F)=V, si a=F alors (F ∨ V)=V

2. **Tautologie plus complexe :**
```
(a ∧ b) → a
Équivalent à : ¬(a ∧ b) ∨ a
```

3. **Lois de De Morgan (tautologies) :**
```
¬(a ∧ b) ↔ (¬a ∨ ¬b)
¬(a ∨ b) ↔ (¬a ∧ ¬b)
```

**Pourquoi Co-NP ?**

| Question | Certificat | Vérification |
|----------|------------|--------------|
| **"OUI, c'est une tautologie"** | ??? Aucun certificat court | Il faut tester TOUTES les 2^n valuations pour prouver que toutes satisfont la formule → **O(2^n)** |
| **"NON, ce n'est PAS une tautologie"** | Une valuation qui rend la formule FAUSSE (contre-exemple) | Évaluer la formule avec cette valuation → **O(m)** polynomial ✓ |

**Caractéristiques Co-NP :**
- **Réponse NON** : facile à vérifier avec un contre-exemple
- **Réponse OUI** : difficile à vérifier (il faut tout tester)

**Exemple de vérification :**

```
Formule : (a ∨ ¬a) ∧ (b ∨ ¬b)    [Tautologie]

Pour prouver que c'est une TAUTOLOGIE (réponse OUI) :
- a=V, b=V : (V∨F) ∧ (V∨F) = V ∧ V = V ✓
- a=V, b=F : (V∨F) ∧ (F∨V) = V ∧ V = V ✓
- a=F, b=V : (F∨V) ∧ (V∨F) = V ∧ V = V ✓
- a=F, b=F : (F∨V) ∧ (F∨V) = V ∧ V = V ✓
→ Toutes vraies → C'est une TAUTOLOGIE ✓

Complexité : O(2^n) - Il faut tout vérifier !
```

**Contre-exemple :**

```
Formule : a ∨ b    [PAS une tautologie]

Pour prouver que ce N'EST PAS une tautologie (réponse NON) :
- Contre-exemple : a=F, b=F → (F∨F) = F ✗
→ Un seul contre-exemple suffit !

Complexité : O(m) - Un seul certificat !
```

**Relation avec SAT et CONTRADICTION :**

```
┌──────────────────────────────────────────────────┐
│         Relations entre problèmes                │
├──────────────────────────────────────────────────┤
│                                                  │
│  SAT (NP)           ⟷  UNSAT (Co-NP)            │
│  "∃ valuation       "∀ valuations               │
│   satisfaisante"     insatisfaisantes"          │
│                                                  │
│  TAUTOLOGIE (Co-NP) ⟷  NON-TAUTOLOGIE (NP)      │
│  "∀ valuations      "∃ valuation                │
│   satisfaisantes"    insatisfaisante"           │
│                                                  │
│  Observation :                                   │
│  TAUTOLOGIE(φ) = UNSAT(¬φ)                      │
│  (φ tautologie ⟺ ¬φ contradiction)              │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Transformation entre TAUTOLOGIE et CONTRADICTION :**

Une formule φ est une **TAUTOLOGIE** si et seulement si **¬φ** est une **CONTRADICTION**.

**Exemple :**
```
φ = a ∨ ¬a          [Tautologie]
¬φ = ¬(a ∨ ¬a)
   = ¬a ∧ ¬¬a       [De Morgan]
   = ¬a ∧ a         [Contradiction !]
```

**Tableau récapitulatif :**

| Problème | Classe | Réponse OUI | Réponse NON |
|----------|--------|-------------|-------------|
| **SAT** | NP | Certificat facile (valuation satisfaisante) | Pas de certificat court |
| **UNSAT** | Co-NP | Pas de certificat court | Certificat facile (valuation satisfaisante) |
| **TAUTOLOGIE** | Co-NP | Pas de certificat court (tester tout) | Certificat facile (contre-exemple) |
| **CONTRADICTION** | Co-NP | Pas de certificat court (tester tout) | Certificat facile (valuation vraie) |

**Pourquoi ces problèmes sont-ils importants ?**

1. **Vérification de circuits logiques** : Un circuit est correct si sa spécification est une tautologie
2. **Preuves automatiques de théorèmes** : Prouver un théorème = montrer que sa négation est une contradiction
3. **Optimisation de code** : Éliminer les conditions toujours vraies (tautologies) ou toujours fausses (contradictions)
4. **Intelligence artificielle** : Raisonnement logique et systèmes experts

**Conclusion :** TAUTOLOGIE ∈ **Co-NP** car prouver qu'une formule est toujours vraie nécessite de vérifier toutes les valuations.

---

## 📊 Tableau récapitulatif : NP vs Co-NP

```
┌────────────────────────────────────────────────────────────────┐
│              PROBLÈMES NP ET Co-NP CLASSIQUES                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Classe NP (certificat pour OUI) :                            │
│  ────────────────────────────────────                         │
│    • SAT / 3SAT                                               │
│      "Existe-t-il une valuation satisfaisante ?"              │
│      OUI → donner la valuation (certificat court) ✓           │
│                                                                │
│    • CLIQUE                                                   │
│      "Existe-t-il une clique de taille k ?"                   │
│      OUI → donner les k sommets (certificat court) ✓          │
│                                                                │
│    • HAMILTONIAN PATH                                         │
│      "Existe-t-il un chemin hamiltonien ?"                    │
│      OUI → donner le chemin (certificat court) ✓              │
│                                                                │
│  Classe Co-NP (certificat pour NON) :                         │
│  ──────────────────────────────────                           │
│    • TAUTOLOGIE                                               │
│      "La formule est-elle toujours vraie ?"                   │
│      NON → donner un contre-exemple (certificat court) ✓      │
│                                                                │
│    • UNSAT / CONTRADICTION                                    │
│      "La formule est-elle insatisfiable ?"                    │
│      NON → donner une valuation satisfaisante ✓               │
│                                                                │
│    • NO-CLIQUE                                                │
│      "N'y a-t-il aucune clique de taille k ?"                 │
│      NON → donner une clique de taille k ✓                    │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                  Question ouverte majeure                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  NP = Co-NP ?                                                  │
│                                                                │
│  • Si NP = Co-NP, alors P = NP (très improbable)              │
│  • On conjecture que NP ≠ Co-NP                               │
│  • Si P ≠ NP, alors NP ≠ Co-NP                                │
│                                                                │
│  Diagramme supposé :                                           │
│                                                                │
│       ┌──────────────────────┐                                │
│       │         NP           │                                 │
│       │    ┌───────────┐    │                                 │
│       │    │  NP∩Co-NP │    │                                 │
│       │    │  (dont P) │    │                                 │
│       │    └───────────┘    │                                 │
│       └──────────────────────┘                                │
│                 │                                              │
│       ┌─────────┴────────────┐                                │
│       │       Co-NP          │                                 │
│       └──────────────────────┘                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Points clés à retenir :**

1. **NP** : Problèmes où une réponse OUI peut être vérifiée rapidement
2. **Co-NP** : Problèmes où une réponse NON peut être vérifiée rapidement
3. **P ⊆ NP ∩ Co-NP** : Les problèmes polynomiaux sont à la fois dans NP et Co-NP
4. **Symétrie** : Si un problème est dans NP, son complément est dans Co-NP
5. **Conjecture** : On pense que NP ≠ Co-NP (mais pas encore prouvé !)
