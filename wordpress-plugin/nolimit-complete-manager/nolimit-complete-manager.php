<?php
/**
 * Plugin Name: NoLimit Complete Manager
 * Description: Gestionnaire complet pour le site NoLimit Aventure - API REST pour React
 * Version: 2.0.0
 * Author: NoLimit Aventure
 * Text Domain: nolimit-manager
 */

if (!defined('ABSPATH')) {
    exit;
}

// ============================================
// CONSTANTES
// ============================================
define('NOLIMIT_MANAGER_VERSION', '8.0.0');
define('NOLIMIT_API_NAMESPACE', 'nolimit/v1');

// ============================================
// ACTIVATION / DÉSACTIVATION
// ============================================
register_activation_hook(__FILE__, 'nolimit_manager_activate');
register_deactivation_hook(__FILE__, 'nolimit_manager_deactivate');

function nolimit_manager_activate() {
    // Créer les options par défaut
    $default_options = array(
        'primary_color' => '#357600',
        'secondary_color' => '#eb700f',
        'green_color' => '#357600',
        'footer_bg_color' => '#111111',
    );
    add_option('nolimit_site_colors', $default_options);
    flush_rewrite_rules();
}

function nolimit_manager_deactivate() {
    flush_rewrite_rules();
}

// ============================================
// ENREGISTREMENT DE L'API REST
// ============================================
add_action('rest_api_init', 'nolimit_register_rest_routes');

function nolimit_register_rest_routes() {

    // ========== HEADER ==========
    register_rest_route(NOLIMIT_API_NAMESPACE, '/header', array(
        'methods' => 'GET',
        'callback' => 'nolimit_get_header_data',
        'permission_callback' => '__return_true',
    ));

    // ========== FOOTER ==========
    register_rest_route(NOLIMIT_API_NAMESPACE, '/footer', array(
        'methods' => 'GET',
        'callback' => 'nolimit_get_footer_data',
        'permission_callback' => '__return_true',
    ));

    // ========== HERO ==========
    register_rest_route(NOLIMIT_API_NAMESPACE, '/hero', array(
        'methods' => 'GET',
        'callback' => 'nolimit_get_hero_data',
        'permission_callback' => '__return_true',
    ));

    // ========== POUR QUI ==========
    register_rest_route(NOLIMIT_API_NAMESPACE, '/pour-qui', array(
        'methods' => 'GET',
        'callback' => 'nolimit_get_pour_qui_data',
        'permission_callback' => '__return_true',
    ));

    // ========== ACTUALITÉS ==========
    register_rest_route(NOLIMIT_API_NAMESPACE, '/actualites', array(
        'methods' => 'GET',
        'callback' => 'nolimit_get_actualites_data',
        'permission_callback' => '__return_true',
    ));

    // ========== NEWSLETTER ==========
    register_rest_route(NOLIMIT_API_NAMESPACE, '/newsletter', array(
        'methods' => 'GET',
        'callback' => 'nolimit_get_newsletter_config',
        'permission_callback' => '__return_true',
    ));

    register_rest_route(NOLIMIT_API_NAMESPACE, '/newsletter/subscribe', array(
        'methods' => 'POST',
        'callback' => 'nolimit_newsletter_subscribe',
        'permission_callback' => '__return_true',
    ));

    // ========== PARCS ==========
    register_rest_route(NOLIMIT_API_NAMESPACE, '/parks', array(
        'methods' => 'GET',
        'callback' => 'nolimit_get_parks',
        'permission_callback' => '__return_true',
    ));

    register_rest_route(NOLIMIT_API_NAMESPACE, '/parks/(?P<id>[a-zA-Z0-9-]+)', array(
        'methods' => 'GET',
        'callback' => 'nolimit_get_park',
        'permission_callback' => '__return_true',
    ));

    // ========== ACTIVITÉS ==========
    register_rest_route(NOLIMIT_API_NAMESPACE, '/activities', array(
        'methods' => 'GET',
        'callback' => 'nolimit_get_activities',
        'permission_callback' => '__return_true',
    ));

    register_rest_route(NOLIMIT_API_NAMESPACE, '/activities/(?P<id>[a-zA-Z0-9-]+)', array(
        'methods' => 'GET',
        'callback' => 'nolimit_get_activity',
        'permission_callback' => '__return_true',
    ));

    // ========== AVIS ==========
    register_rest_route(NOLIMIT_API_NAMESPACE, '/reviews', array(
        'methods' => 'GET',
        'callback' => 'nolimit_get_reviews',
        'permission_callback' => '__return_true',
    ));

    // ========== FAQ ==========
    register_rest_route(NOLIMIT_API_NAMESPACE, '/faq', array(
        'methods' => 'GET',
        'callback' => 'nolimit_get_faq',
        'permission_callback' => '__return_true',
    ));

    // ========== CONTACT ==========
    register_rest_route(NOLIMIT_API_NAMESPACE, '/contact', array(
        'methods' => 'GET',
        'callback' => 'nolimit_get_contact_config',
        'permission_callback' => '__return_true',
    ));

    register_rest_route(NOLIMIT_API_NAMESPACE, '/contact/submit', array(
        'methods' => 'POST',
        'callback' => 'nolimit_submit_contact',
        'permission_callback' => '__return_true',
    ));

    // ========== GROUPES ==========
    register_rest_route(NOLIMIT_API_NAMESPACE, '/groups', array(
        'methods' => 'GET',
        'callback' => 'nolimit_get_groups_data',
        'permission_callback' => '__return_true',
    ));
}

// ============================================
// CALLBACKS API - HEADER
// ============================================
function nolimit_get_header_data() {
    $colors = get_option('nolimit_site_colors', array());

    // Récupérer les menus WordPress
    $menu_items = array();
    $menu_locations = get_nav_menu_locations();

    if (isset($menu_locations['primary'])) {
        $menu = wp_get_nav_menu_items($menu_locations['primary']);
        if ($menu) {
            foreach ($menu as $index => $item) {
                $menu_items[] = array(
                    'id' => $item->ID,
                    'label' => $item->title,
                    'type' => 'simple',
                    'url' => str_replace(home_url(), '', $item->url),
                    'position' => $index,
                );
            }
        }
    }

    // Récupérer les parcs pour le sélecteur
    $parks = nolimit_get_parks_for_selector();

    return array(
        'logo' => array(
            'url' => get_custom_logo() ? wp_get_attachment_image_src(get_theme_mod('custom_logo'), 'full')[0] : null,
            'alt' => get_bloginfo('name'),
        ),
        'primaryColor' => isset($colors['primary_color']) ? $colors['primary_color'] : '#357600',
        'secondaryColor' => isset($colors['secondary_color']) ? $colors['secondary_color'] : '#eb700f',
        'greenColor' => isset($colors['green_color']) ? $colors['green_color'] : '#357600',
        'ctaText' => get_option('nolimit_header_cta_text', 'Réserver'),
        'ctaUrl' => get_option('nolimit_header_cta_url', '/booking'),
        'showParkSelector' => (bool) get_option('nolimit_show_park_selector', true),
        'menuItems' => $menu_items,
        'parks' => $parks,
    );
}

// ============================================
// CALLBACKS API - FOOTER
// ============================================
function nolimit_get_footer_data() {
    $colors = get_option('nolimit_site_colors', array());
    $parks = nolimit_get_parks_for_footer();

    return array(
        'colors' => array(
            'background' => isset($colors['footer_bg_color']) ? $colors['footer_bg_color'] : '#111111',
            'primary' => isset($colors['primary_color']) ? $colors['primary_color'] : '#357600',
            'secondary' => isset($colors['secondary_color']) ? $colors['secondary_color'] : '#eb700f',
        ),
        'contact' => array(
            'phone' => get_option('nolimit_contact_phone', '01 23 45 67 89'),
            'email' => get_option('nolimit_contact_email', 'contact@nolimit-aventure.fr'),
            'description' => get_option('nolimit_site_description', '5 parcs multi-activités en France pour vivre des sensations fortes en pleine nature.'),
        ),
        'stats' => array(
            array('number' => '5', 'label' => 'Parcs'),
            array('number' => '20+', 'label' => 'Activités'),
            array('number' => '∞', 'label' => 'Souvenirs'),
        ),
        'quickLinks' => array(
            array('label' => 'Nos Parcs', 'to' => '/parks'),
            array('label' => 'Activités', 'to' => '/activities'),
            array('label' => 'Réserver', 'to' => '/booking'),
            array('label' => 'Groupes & Événements', 'to' => '/groups'),
            array('label' => 'FAQ', 'to' => '/faq'),
            array('label' => 'Contact', 'to' => '/contact'),
        ),
        'activities' => nolimit_get_activities_for_footer(),
        'legalLinks' => array(
            array('label' => 'Mentions légales', 'to' => '/legal'),
            array('label' => 'Politique de confidentialité', 'to' => '/privacy'),
            array('label' => 'CGV', 'to' => '/terms'),
            array('label' => 'Règlement intérieur', 'to' => '/rules'),
        ),
        'cta' => array(
            'title' => get_option('nolimit_footer_cta_title', "Rejoignez l'aventure"),
            'subtitle' => get_option('nolimit_footer_cta_subtitle', "Réservez dès maintenant et vivez une expérience inoubliable dans l'un de nos 5 parcs"),
            'bookingUrl' => '/booking',
            'contactUrl' => '/contact',
        ),
        'parks' => $parks,
        'showBackToTop' => true,
        'currentYear' => (int) date('Y'),
    );
}

// ============================================
// CALLBACKS API - HERO
// ============================================
function nolimit_get_hero_data() {
    // Récupérer les slides depuis ACF ou options
    $slides = array();

    // Essayer de récupérer depuis ACF (si installé)
    if (function_exists('get_field')) {
        $acf_slides = get_field('hero_slides', 'option');
        if ($acf_slides && is_array($acf_slides)) {
            foreach ($acf_slides as $slide) {
                $slides[] = array(
                    'id' => isset($slide['id']) ? $slide['id'] : uniqid(),
                    'url' => isset($slide['image']) ? $slide['image']['url'] : '',
                    'title' => isset($slide['title']) ? $slide['title'] : '',
                    'subtitle' => isset($slide['subtitle']) ? $slide['subtitle'] : '',
                    'ctaText' => isset($slide['cta_text']) ? $slide['cta_text'] : '',
                    'ctaUrl' => isset($slide['cta_url']) ? $slide['cta_url'] : '',
                );
            }
        }
    }

    return array(
        'slides' => $slides,
        'badge' => array(
            'text' => get_option('nolimit_hero_badge_text', "L'aventure commence ici"),
            'icon' => 'Sparkles',
        ),
        'mainTitle' => array(
            'line1' => get_option('nolimit_hero_title_line1', "L'aventure vous"),
            'highlight' => get_option('nolimit_hero_title_highlight', 'appelle'),
        ),
        'video' => array(
            'url' => get_option('nolimit_hero_video_url', ''),
            'thumbnail' => get_option('nolimit_hero_video_thumbnail', ''),
            'buttonText' => get_option('nolimit_hero_video_button', 'Voir la vidéo'),
            'description' => get_option('nolimit_hero_video_desc', "Découvrez l'expérience"),
        ),
    );
}

// ============================================
// CALLBACKS API - POUR QUI
// ============================================
function nolimit_get_pour_qui_data() {
    $cards = array();

    // Récupérer depuis ACF si disponible
    if (function_exists('get_field')) {
        $acf_cards = get_field('pour_qui_cards', 'option');
        if ($acf_cards && is_array($acf_cards)) {
            foreach ($acf_cards as $card) {
                $cards[] = array(
                    'id' => isset($card['id']) ? $card['id'] : sanitize_title($card['title']),
                    'title' => isset($card['title']) ? $card['title'] : '',
                    'description' => isset($card['description']) ? $card['description'] : '',
                    'image' => isset($card['image']) ? $card['image']['url'] : '',
                    'link' => isset($card['link']) ? $card['link'] : '/',
                    'iconName' => isset($card['icon']) ? $card['icon'] : 'Star',
                    'color' => isset($card['color']) ? $card['color'] : '#357600',
                );
            }
        }
    }

    return array(
        'title' => get_option('nolimit_pourqui_title', 'Pour Qui ?'),
        'subtitle' => get_option('nolimit_pourqui_subtitle', "Que vous soyez en duo, en famille, avec des enfants ou en équipe, nous avons l'aventure qu'il vous faut"),
        'cards' => $cards,
    );
}

// ============================================
// CALLBACKS API - ACTUALITÉS
// ============================================
function nolimit_get_actualites_data() {
    $articles = array();

    // Récupérer les posts de type 'actualite' ou 'post'
    $post_type = post_type_exists('actualite') ? 'actualite' : 'post';

    $query = new WP_Query(array(
        'post_type' => $post_type,
        'posts_per_page' => 6,
        'orderby' => 'date',
        'order' => 'DESC',
    ));

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();

            // Vérifier si c'est un événement
            $is_event = false;
            $registration_link = '';

            if (function_exists('get_field')) {
                $is_event = get_field('is_evenement', $post_id);
                $registration_link = get_field('lien_inscription', $post_id);
            }

            $articles[] = array(
                'id' => (string) $post_id,
                'titre' => get_the_title(),
                'date' => get_the_date('Y-m-d'),
                'image' => get_the_post_thumbnail_url($post_id, 'large') ?: '',
                'extrait' => wp_trim_words(get_the_excerpt(), 30),
                'isEvenement' => (bool) $is_event,
                'lienInscription' => $registration_link ?: null,
                'lien' => '/actualites/' . get_post_field('post_name', $post_id),
                'categorie' => '',
                'auteur' => get_the_author(),
            );
        }
        wp_reset_postdata();
    }

    return array(
        'title' => get_option('nolimit_actualites_title', 'Actualités & Événements'),
        'subtitle' => get_option('nolimit_actualites_subtitle', 'Restez informé de nos dernières nouveautés et événements spéciaux'),
        'showViewAllButton' => true,
        'viewAllUrl' => '/actualites',
        'articles' => $articles,
    );
}

// ============================================
// CALLBACKS API - NEWSLETTER
// ============================================
function nolimit_get_newsletter_config() {
    return array(
        'title' => get_option('nolimit_newsletter_title', 'Restez informé de nos aventures'),
        'subtitle' => get_option('nolimit_newsletter_subtitle', "Recevez nos offres exclusives, nouveautés et conseils d'aventure directement dans votre boîte mail"),
        'placeholder' => get_option('nolimit_newsletter_placeholder', 'Votre adresse email'),
        'buttonText' => get_option('nolimit_newsletter_button', "S'inscrire"),
        'privacyNotice' => get_option('nolimit_newsletter_privacy', 'En vous inscrivant, vous acceptez de recevoir nos emails. Vous pouvez vous désabonner à tout moment.'),
        'successMessage' => get_option('nolimit_newsletter_success', 'Merci ! Vous êtes inscrit à notre newsletter'),
        'benefits' => array(
            array('icon' => '🎟️', 'title' => 'Offres exclusives', 'description' => 'Réductions réservées aux abonnés'),
            array('icon' => '🎯', 'title' => 'Nouveautés en avant-première', 'description' => 'Soyez les premiers informés'),
            array('icon' => '💡', 'title' => "Conseils d'experts", 'description' => 'Astuces pour profiter au maximum'),
        ),
    );
}

function nolimit_newsletter_subscribe($request) {
    $email = sanitize_email($request->get_param('email'));

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Adresse email invalide', array('status' => 400));
    }

    // Ici, intégrer avec votre service newsletter (Mailchimp, Sendinblue, etc.)
    // Pour l'instant, on stocke juste dans une option WordPress
    $subscribers = get_option('nolimit_newsletter_subscribers', array());

    if (in_array($email, $subscribers)) {
        return new WP_Error('already_subscribed', 'Vous êtes déjà inscrit', array('status' => 409));
    }

    $subscribers[] = $email;
    update_option('nolimit_newsletter_subscribers', $subscribers);

    return array(
        'success' => true,
        'message' => 'Inscription réussie !',
    );
}

// ============================================
// CALLBACKS API - PARCS
// ============================================
function nolimit_get_parks() {
    $parks = array();

    // Vérifier si le CPT 'park' existe
    if (post_type_exists('park')) {
        $query = new WP_Query(array(
            'post_type' => 'park',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ));

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $parks[] = nolimit_format_park_data(get_the_ID());
            }
            wp_reset_postdata();
        }
    }

    return $parks;
}

function nolimit_get_park($request) {
    $id = $request->get_param('id');

    // Chercher par slug ou ID
    $park = get_page_by_path($id, OBJECT, 'park');

    if (!$park) {
        $park = get_post($id);
    }

    if (!$park || $park->post_type !== 'park') {
        return new WP_Error('park_not_found', 'Parc non trouvé', array('status' => 404));
    }

    return nolimit_format_park_data($park->ID, true);
}

function nolimit_format_park_data($post_id, $full = false) {
    $data = array(
        'id' => get_post_field('post_name', $post_id),
        'name' => get_the_title($post_id),
        'location' => '',
        'description' => get_the_excerpt($post_id) ?: wp_trim_words(get_the_content(null, false, $post_id), 30),
        'image' => get_the_post_thumbnail_url($post_id, 'large') ?: '',
        'activities' => array(),
        'difficulty' => array('Débutant'),
        'minAge' => 3,
        'rating' => 4.5,
        'reviewCount' => 0,
        'minPrice' => 20,
        'capacity' => 100,
        'highlights' => array(),
    );

    // Récupérer les champs ACF si disponibles
    if (function_exists('get_field')) {
        $data['location'] = get_field('location', $post_id) ?: '';
        $data['minAge'] = (int) (get_field('min_age', $post_id) ?: 3);
        $data['rating'] = (float) (get_field('rating', $post_id) ?: 4.5);
        $data['minPrice'] = (int) (get_field('min_price', $post_id) ?: 20);
        $data['capacity'] = (int) (get_field('capacity', $post_id) ?: 100);

        $activities = get_field('activities', $post_id);
        if ($activities && is_array($activities)) {
            $data['activities'] = $activities;
        }

        $difficulty = get_field('difficulty', $post_id);
        if ($difficulty && is_array($difficulty)) {
            $data['difficulty'] = $difficulty;
        }

        $highlights = get_field('highlights', $post_id);
        if ($highlights && is_array($highlights)) {
            $data['highlights'] = $highlights;
        }

        if ($full) {
            $data['gallery'] = array();
            $gallery = get_field('gallery', $post_id);
            if ($gallery && is_array($gallery)) {
                foreach ($gallery as $image) {
                    $data['gallery'][] = $image['url'];
                }
            }

            $data['coordinates'] = array(
                'lat' => (float) (get_field('latitude', $post_id) ?: 0),
                'lng' => (float) (get_field('longitude', $post_id) ?: 0),
            );

            $data['contact'] = array(
                'phone' => get_field('phone', $post_id) ?: '',
                'email' => get_field('email', $post_id) ?: '',
                'address' => get_field('address', $post_id) ?: '',
            );

            $data['openingHours'] = array(
                'weekdays' => get_field('opening_weekdays', $post_id) ?: '',
                'weekends' => get_field('opening_weekends', $post_id) ?: '',
                'holidays' => get_field('opening_holidays', $post_id) ?: '',
            );
        }
    }

    return $data;
}

// ============================================
// CALLBACKS API - ACTIVITÉS
// ============================================
function nolimit_get_activities() {
    $activities = array();

    if (post_type_exists('activity')) {
        $query = new WP_Query(array(
            'post_type' => 'activity',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ));

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $activities[] = nolimit_format_activity_data(get_the_ID());
            }
            wp_reset_postdata();
        }
    }

    return $activities;
}

function nolimit_get_activity($request) {
    $id = $request->get_param('id');

    $activity = get_page_by_path($id, OBJECT, 'activity');

    if (!$activity) {
        $activity = get_post($id);
    }

    if (!$activity || $activity->post_type !== 'activity') {
        return new WP_Error('activity_not_found', 'Activité non trouvée', array('status' => 404));
    }

    return nolimit_format_activity_data($activity->ID, true);
}

function nolimit_format_activity_data($post_id, $full = false) {
    $data = array(
        'id' => get_post_field('post_name', $post_id),
        'slug' => get_post_field('post_name', $post_id),
        'name' => get_the_title($post_id),
        'description' => get_the_content(null, false, $post_id) ?: '',
        'image' => get_the_post_thumbnail_url($post_id, 'large') ?: '',
        'difficulty' => 'Intermédiaire',
        'intensity' => 'medium',
        'minAge' => 8,
        'duration' => '2h',
        'price' => 25,
        'participants' => 'Groupe',
        'emoji' => '🎯',
        'restrictions' => array(),
    );

    if (function_exists('get_field')) {
        $data['difficulty'] = get_field('difficulty', $post_id) ?: 'Intermédiaire';
        $data['intensity'] = get_field('intensity', $post_id) ?: 'medium';
        $data['minAge'] = (int) (get_field('min_age', $post_id) ?: 8);
        $data['duration'] = get_field('duration', $post_id) ?: '2h';
        $data['price'] = get_field('price', $post_id) ?: 25;
        $data['participants'] = get_field('participants', $post_id) ?: 'Groupe';
        $data['emoji'] = get_field('emoji', $post_id) ?: '🎯';
        $data['icon'] = get_field('icon', $post_id) ?: 'Star';

        $restrictions = get_field('restrictions', $post_id);
        if ($restrictions && is_array($restrictions)) {
            $data['restrictions'] = $restrictions;
        }

        if ($full) {
            $data['gallery'] = array();
            $gallery = get_field('gallery', $post_id);
            if ($gallery && is_array($gallery)) {
                foreach ($gallery as $image) {
                    $data['gallery'][] = $image['url'];
                }
            }

            $data['equipment'] = get_field('equipment', $post_id) ?: array();
            $data['parkIds'] = get_field('available_parks', $post_id) ?: array();
        }
    }

    return $data;
}

// ============================================
// CALLBACKS API - AVIS
// ============================================
function nolimit_get_reviews($request) {
    $reviews = array();
    $park_id = $request->get_param('park_id');
    $limit = $request->get_param('limit') ?: 10;

    // Utiliser les commentaires WordPress comme avis
    $args = array(
        'status' => 'approve',
        'number' => (int) $limit,
        'orderby' => 'comment_date',
        'order' => 'DESC',
    );

    if ($park_id) {
        // Chercher le post ID du parc
        $park = get_page_by_path($park_id, OBJECT, 'park');
        if ($park) {
            $args['post_id'] = $park->ID;
        }
    }

    $comments = get_comments($args);

    foreach ($comments as $comment) {
        $rating = get_comment_meta($comment->comment_ID, 'rating', true) ?: 5;

        $reviews[] = array(
            'id' => (string) $comment->comment_ID,
            'author' => $comment->comment_author,
            'avatar' => get_avatar_url($comment->comment_author_email),
            'rating' => (int) $rating,
            'date' => date_i18n('j F Y', strtotime($comment->comment_date)),
            'comment' => $comment->comment_content,
            'parkId' => get_post_field('post_name', $comment->comment_post_ID),
            'parkName' => get_the_title($comment->comment_post_ID),
            'verified' => true,
        );
    }

    return $reviews;
}

// ============================================
// CALLBACKS API - FAQ
// ============================================
function nolimit_get_faq() {
    $items = array();

    if (post_type_exists('faq')) {
        $query = new WP_Query(array(
            'post_type' => 'faq',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ));

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $items[] = array(
                    'id' => (string) get_the_ID(),
                    'question' => get_the_title(),
                    'answer' => get_the_content(),
                    'category' => '',
                );
            }
            wp_reset_postdata();
        }
    }

    return array(
        'title' => get_option('nolimit_faq_title', 'Questions fréquentes'),
        'subtitle' => get_option('nolimit_faq_subtitle', 'Trouvez rapidement les réponses à vos questions'),
        'items' => $items,
        'categories' => array(),
    );
}

// ============================================
// CALLBACKS API - CONTACT
// ============================================
function nolimit_get_contact_config() {
    return array(
        'title' => get_option('nolimit_contact_title', 'Contactez-nous'),
        'subtitle' => get_option('nolimit_contact_subtitle', "Une question ? N'hésitez pas à nous contacter"),
        'phone' => get_option('nolimit_contact_phone', '01 23 45 67 89'),
        'email' => get_option('nolimit_contact_email', 'contact@nolimit-aventure.fr'),
        'address' => get_option('nolimit_contact_address', ''),
        'openingHours' => get_option('nolimit_contact_hours', ''),
        'mapUrl' => get_option('nolimit_contact_map_url', ''),
        'formFields' => array(
            'name' => true,
            'email' => true,
            'phone' => true,
            'subject' => true,
            'message' => true,
            'park' => true,
        ),
    );
}

function nolimit_submit_contact($request) {
    $name = sanitize_text_field($request->get_param('name'));
    $email = sanitize_email($request->get_param('email'));
    $subject = sanitize_text_field($request->get_param('subject'));
    $message = sanitize_textarea_field($request->get_param('message'));

    if (empty($name) || empty($email) || empty($message)) {
        return new WP_Error('missing_fields', 'Veuillez remplir tous les champs obligatoires', array('status' => 400));
    }

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Adresse email invalide', array('status' => 400));
    }

    // Envoyer l'email
    $to = get_option('nolimit_contact_email', get_option('admin_email'));
    $email_subject = '[NoLimit Contact] ' . ($subject ?: 'Nouveau message');
    $email_body = "Nom: $name\nEmail: $email\n\nMessage:\n$message";

    $sent = wp_mail($to, $email_subject, $email_body);

    if (!$sent) {
        return new WP_Error('send_failed', "Erreur lors de l'envoi du message", array('status' => 500));
    }

    return array(
        'success' => true,
        'message' => 'Message envoyé avec succès !',
    );
}

// ============================================
// CALLBACKS API - GROUPES
// ============================================
function nolimit_get_groups_data() {
    $types = array();

    if (function_exists('get_field')) {
        $acf_types = get_field('group_types', 'option');
        if ($acf_types && is_array($acf_types)) {
            foreach ($acf_types as $type) {
                $types[] = array(
                    'id' => isset($type['id']) ? $type['id'] : sanitize_title($type['name']),
                    'name' => $type['name'] ?? '',
                    'description' => $type['description'] ?? '',
                    'image' => isset($type['image']) ? $type['image']['url'] : '',
                    'icon' => $type['icon'] ?? 'Users',
                    'minPersons' => (int) ($type['min_persons'] ?? 10),
                    'maxPersons' => (int) ($type['max_persons'] ?? 100),
                    'pricePerPerson' => (float) ($type['price'] ?? 20),
                    'features' => $type['features'] ?? array(),
                );
            }
        }
    }

    return array(
        'title' => get_option('nolimit_groups_title', 'Groupes & Événements'),
        'subtitle' => get_option('nolimit_groups_subtitle', 'Team building, anniversaires, séminaires... Nous avons la formule adaptée'),
        'types' => $types,
        'benefits' => array(
            'Tarifs dégressifs',
            'Espaces privatisés',
            'Animateurs dédiés',
            'Restauration sur place',
        ),
        'ctaText' => 'Demander un devis',
        'ctaUrl' => '/groups/quote',
    );
}

// ============================================
// FONCTIONS HELPER
// ============================================
function nolimit_get_parks_for_selector() {
    $parks = array();

    if (post_type_exists('park')) {
        $query = new WP_Query(array(
            'post_type' => 'park',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ));

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $post_id = get_the_ID();

                $emoji = '🌳';
                $location = '';

                if (function_exists('get_field')) {
                    $emoji = get_field('emoji', $post_id) ?: '🌳';
                    $location = get_field('location', $post_id) ?: '';
                }

                $parks[] = array(
                    'id' => get_post_field('post_name', $post_id),
                    'name' => get_the_title(),
                    'location' => $location,
                    'emoji' => $emoji,
                    'url' => '/parks/' . get_post_field('post_name', $post_id),
                );
            }
            wp_reset_postdata();
        }
    }

    return $parks;
}

function nolimit_get_parks_for_footer() {
    $parks = array();

    if (post_type_exists('park')) {
        $query = new WP_Query(array(
            'post_type' => 'park',
            'posts_per_page' => 5,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ));

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $post_id = get_the_ID();

                $data = array(
                    'id' => get_post_field('post_name', $post_id),
                    'name' => get_the_title(),
                    'location' => '',
                    'emoji' => '🌳',
                    'minAge' => 3,
                    'rating' => 4.5,
                    'minPrice' => 20,
                    'activities' => array(),
                );

                if (function_exists('get_field')) {
                    $data['location'] = get_field('location', $post_id) ?: '';
                    $data['emoji'] = get_field('emoji', $post_id) ?: '🌳';
                    $data['minAge'] = (int) (get_field('min_age', $post_id) ?: 3);
                    $data['rating'] = (float) (get_field('rating', $post_id) ?: 4.5);
                    $data['minPrice'] = (int) (get_field('min_price', $post_id) ?: 20);
                    $data['activities'] = get_field('activities', $post_id) ?: array();
                }

                $parks[] = $data;
            }
            wp_reset_postdata();
        }
    }

    return $parks;
}

function nolimit_get_activities_for_footer() {
    $activities = array();

    if (post_type_exists('activity')) {
        $query = new WP_Query(array(
            'post_type' => 'activity',
            'posts_per_page' => 6,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ));

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $post_id = get_the_ID();

                $emoji = '🎯';
                if (function_exists('get_field')) {
                    $emoji = get_field('emoji', $post_id) ?: '🎯';
                }

                $activities[] = array(
                    'name' => get_the_title(),
                    'emoji' => $emoji,
                    'link' => '/activities/' . get_post_field('post_name', $post_id),
                );
            }
            wp_reset_postdata();
        }
    }

    // Si pas d'activités en BDD, retourner des valeurs par défaut
    if (empty($activities)) {
        $activities = array(
            array('name' => 'Accrobranche', 'emoji' => '🌳', 'link' => '/activities/accrobranche'),
            array('name' => 'Paintball', 'emoji' => '🎯', 'link' => '/activities/paintball'),
            array('name' => 'Tyrolienne', 'emoji' => '⚡', 'link' => '/activities/tyrolienne'),
            array('name' => "Tir à l'arc", 'emoji' => '🏹', 'link' => '/activities/archery'),
            array('name' => 'Escape Game', 'emoji' => '🔐', 'link' => '/activities/escape'),
            array('name' => 'Parcours Filet', 'emoji' => '🕸️', 'link' => '/activities/filet'),
        );
    }

    return $activities;
}

// ============================================
// CORS HEADERS
// ============================================
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
}, 15);
