document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation SPA (Onglets)
    const tabButtons = document.querySelectorAll('.tab-btn');
    const modules = document.querySelectorAll('.module');

    // Fonction pour charger le contenu dynamiquement via fetch
    async function loadModuleContent(moduleElement) {
        if (moduleElement.dataset.loaded === 'true') return; // Déjà chargé
        
        const src = moduleElement.getAttribute('data-src');
        if (!src) return;

        try {
            const response = await fetch(src);
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            const html = await response.text();
            moduleElement.innerHTML = html;
            moduleElement.dataset.loaded = 'true';

            // Redemander à MathJax de compiler les nouvelles formules
            if (window.MathJax && window.MathJax.typesetPromise) {
                MathJax.typesetPromise([moduleElement]).catch((err) => console.log('Erreur MathJax:', err.message));
            } else if (window.MathJax && window.MathJax.typeset) {
                 MathJax.typeset([moduleElement]);
            }
        } catch (error) {
            console.error('Erreur lors du chargement du module:', error);
            moduleElement.innerHTML = `<div class="card"><p>Erreur lors du chargement du contenu : ${error.message}. <br><small>Note: Le chargement dynamique (fetch) nécessite un serveur local (ex: python3 -m http.server).</small></p></div>`;
        }
    }

    // Charger le module actif au démarrage
    const activeModule = document.querySelector('.module.active');
    if (activeModule) {
        loadModuleContent(activeModule);
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer l'état actif de tous les boutons
            tabButtons.forEach(b => b.classList.remove('active'));
            // Ajouter l'état actif au bouton cliqué
            btn.classList.add('active');

            // Récupérer l'ID du module cible
            const targetId = btn.getAttribute('data-target');
            const targetModule = document.getElementById(targetId);

            // Masquer tous les modules
            modules.forEach(mod => mod.classList.remove('active'));
            // Afficher le module cible
            targetModule.classList.add('active');
            
            // Charger le contenu s'il n'est pas encore là
            loadModuleContent(targetModule);
            
            // Si on change d'onglet, on s'assure de remonter en haut de la page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // 2. Mode Examen (Floutage des corrections)
    const examModeToggle = document.getElementById('exam-mode-toggle');
    const body = document.body;

    examModeToggle.addEventListener('click', () => {
        // Basculer la classe sur le body
        body.classList.toggle('exam-mode');
        
        // Mettre à jour l'apparence du bouton
        if (body.classList.contains('exam-mode')) {
            examModeToggle.classList.add('active');
            examModeToggle.innerHTML = '<span class="icon">📝</span> Mode Examen Actif';
        } else {
            examModeToggle.classList.remove('active');
            examModeToggle.innerHTML = '<span class="icon">👁️</span> Mode Réécriture';
        }
    });
});