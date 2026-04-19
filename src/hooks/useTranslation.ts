import { useState, useEffect, useCallback } from "react";

// Translation dictionaries
const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.guide": "Guide",
    "nav.characters": "Characters",
    "nav.world": "World",
    "nav.more": "More",
    "nav.community": "Community",
    "nav.feed": "Feed",
    "nav.voidy": "Voidy",
    "nav.messages": "Messages",
    "nav.groups": "Groups",
    "nav.watch": "Watch",
    "nav.ai_chat": "AI Chat",

    // Common
    "common.search": "Search",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.retry": "Retry",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.close": "Close",
    "common.open": "Open",
    "common.view": "View",
    "common.read_more": "Read More",
    "common.show_less": "Show Less",
    "common.prev": "Prev",
    "common.next": "Next",
    "common.unknown": "Unknown",
    "common.all": "All",
    "common.none": "None",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.newest": "Newest",
    "common.oldest": "Oldest",

    // Watch Page
    "watch.now_playing": "NOW PLAYING",
    "watch.episodes": "Episodes",
    "watch.episode": "Episode",
    "watch.season": "Season",
    "watch.servers": "Servers",
    "watch.sources": "Sources",
    "watch.show_sources": "Show Source Links",
    "watch.hide_sources": "Hide Source Links",
    "watch.watch_on": "Watch on source sites:",
    "watch.next_episode": "Next episode",
    "watch.released": "Released",
    "watch.unknown_release": "Unknown release date",
    "watch.episode_count": "{count} episodes",
    "watch.airing": "Airing",
    "watch.completed": "Completed",
    "watch.rating": "Rating",
    "watch.duration": "Duration",
    "watch.studio": "Studio",
    "watch.genres": "Genres",

    // AI Chat
    "chat.new_conversation": "New Conversation",
    "chat.conversations": "Conversations",
    "chat.no_conversations": "No conversations yet",
    "chat.message_placeholder": "Type your message...",
    "chat.send": "Send",
    "chat.thinking": "Thinking...",
    "chat.welcome": "Ask me anything about Renegade Immortal!",
    "chat.delete_confirm": "Delete this conversation?",
    "chat.rename": "Rename",
    "chat.created": "Created",
    "chat.updated": "Updated",

    // Feed
    "feed.title": "Feed",
    "feed.new_post": "New Post",
    "feed.no_posts": "No posts yet",
    "feed.write_something": "Write something...",
    "feed.post": "Post",
    "feed.like": "Like",
    "feed.comment": "Comment",
    "feed.share": "Share",
    "feed.delete_post": "Delete Post",

    // Community
    "community.members": "Members",
    "community.online": "Online",
    "community.join": "Join Community",
    "community.leave": "Leave Community",

    // Characters
    "characters.title": "Characters",
    "characters.cultivation": "Cultivation",
    "characters.affiliation": "Affiliation",
    "characters.status": "Status",
    "characters.debut": "Debut",
    "characters.allegiance": "Allegiance",

    // World
    "world.locations": "Locations",
    "world.realm": "Realm",
    "world.sect": "Sect",
    "world.cultivation": "Cultivation System",
    "world.artifacts": "Artifacts",

    // Guide
    "guide.beginners": "Beginner's Guide",
    "guide.cultivation": "Cultivation Guide",
    "guide.timeline": "Timeline",
    "guide.faq": "FAQ",

    // Errors
    "error.generic": "Something went wrong",
    "error.not_found": "Page not found",
    "error.no_connection": "No connection",
    "error.try_again": "Please try again",
  },

  zh: {
    // Navigation
    "nav.home": "首页",
    "nav.guide": "指南",
    "nav.characters": "角色",
    "nav.world": "世界",
    "nav.more": "更多",
    "nav.community": "社区",
    "nav.feed": "动态",
    "nav.voidy": "Voidy",
    "nav.messages": "消息",
    "nav.groups": "群组",
    "nav.watch": "观看",
    "nav.ai_chat": "AI聊天",

    // Common
    "common.search": "搜索",
    "common.loading": "加载中...",
    "common.error": "错误",
    "common.retry": "重试",
    "common.save": "保存",
    "common.cancel": "取消",
    "common.delete": "删除",
    "common.edit": "编辑",
    "common.close": "关闭",
    "common.open": "打开",
    "common.view": "查看",
    "common.read_more": "阅读更多",
    "common.show_less": "收起",
    "common.prev": "上一页",
    "common.next": "下一页",
    "common.unknown": "未知",
    "common.all": "全部",
    "common.none": "无",
    "common.filter": "筛选",
    "common.sort": "排序",
    "common.newest": "最新",
    "common.oldest": "最早",

    // Watch Page
    "watch.now_playing": "正在播放",
    "watch.episodes": "剧集",
    "watch.episode": "集",
    "watch.season": "季",
    "watch.servers": "服务器",
    "watch.sources": "来源",
    "watch.show_sources": "显示来源链接",
    "watch.hide_sources": "隐藏来源链接",
    "watch.watch_on": "在来源网站观看：",
    "watch.next_episode": "下一集",
    "watch.released": "已发布",
    "watch.unknown_release": "未知发布日期",
    "watch.episode_count": "{count}集",
    "watch.airing": "连载中",
    "watch.completed": "已完结",
    "watch.rating": "评分",
    "watch.duration": "时长",
    "watch.studio": "制作公司",
    "watch.genres": "类型",

    // AI Chat
    "chat.new_conversation": "新对话",
    "chat.conversations": "对话列表",
    "chat.no_conversations": "暂无对话",
    "chat.message_placeholder": "输入消息...",
    "chat.send": "发送",
    "chat.thinking": "思考中...",
    "chat.welcome": "问我任何关于仙逆的问题！",
    "chat.delete_confirm": "删除此对话？",
    "chat.rename": "重命名",
    "chat.created": "创建时间",
    "chat.updated": "更新时间",

    // Feed
    "feed.title": "动态",
    "feed.new_post": "发布动态",
    "feed.no_posts": "暂无动态",
    "feed.write_something": "写点什么...",
    "feed.post": "发布",
    "feed.like": "点赞",
    "feed.comment": "评论",
    "feed.share": "分享",
    "feed.delete_post": "删除动态",

    // Community
    "community.members": "成员",
    "community.online": "在线",
    "community.join": "加入社区",
    "community.leave": "离开社区",

    // Characters
    "characters.title": "角色",
    "characters.cultivation": "修为",
    "characters.affiliation": "所属",
    "characters.status": "状态",
    "characters.debut": "首次登场",
    "characters.allegiance": "效忠",

    // World
    "world.locations": "地点",
    "world.realm": "境界",
    "world.sect": "宗门",
    "world.cultivation": "修炼体系",
    "world.artifacts": "法宝",

    // Guide
    "guide.beginners": "新手指南",
    "guide.cultivation": "修炼指南",
    "guide.timeline": "时间线",
    "guide.faq": "常见问题",

    // Errors
    "error.generic": "出了点问题",
    "error.not_found": "页面未找到",
    "error.no_connection": "无网络连接",
    "error.try_again": "请重试",
  },

  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.guide": "Guía",
    "nav.characters": "Personajes",
    "nav.world": "Mundo",
    "nav.more": "Más",
    "nav.community": "Comunidad",
    "nav.feed": "Feed",
    "nav.voidy": "Voidy",
    "nav.messages": "Mensajes",
    "nav.groups": "Grupos",
    "nav.watch": "Ver",
    "nav.ai_chat": "Chat IA",

    // Common
    "common.search": "Buscar",
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.retry": "Reintentar",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.close": "Cerrar",
    "common.open": "Abrir",
    "common.view": "Ver",
    "common.read_more": "Leer más",
    "common.show_less": "Mostrar menos",
    "common.prev": "Anterior",
    "common.next": "Siguiente",
    "common.unknown": "Desconocido",
    "common.all": "Todos",
    "common.none": "Ninguno",
    "common.filter": "Filtrar",
    "common.sort": "Ordenar",
    "common.newest": "Más nuevo",
    "common.oldest": "Más antiguo",

    // Watch Page
    "watch.now_playing": "REPRODUCIENDO AHORA",
    "watch.episodes": "Episodios",
    "watch.episode": "Episodio",
    "watch.season": "Temporada",
    "watch.servers": "Servidores",
    "watch.sources": "Fuentes",
    "watch.show_sources": "Mostrar enlaces de fuentes",
    "watch.hide_sources": "Ocultar enlaces de fuentes",
    "watch.watch_on": "Ver en sitios de origen:",
    "watch.next_episode": "Próximo episodio",
    "watch.released": "Lanzado",
    "watch.unknown_release": "Fecha de lanzamiento desconocida",
    "watch.episode_count": "{count} episodios",
    "watch.airing": "En emisión",
    "watch.completed": "Completado",
    "watch.rating": "Calificación",
    "watch.duration": "Duración",
    "watch.studio": "Estudio",
    "watch.genres": "Géneros",

    // AI Chat
    "chat.new_conversation": "Nueva Conversación",
    "chat.conversations": "Conversaciones",
    "chat.no_conversations": "Aún no hay conversaciones",
    "chat.message_placeholder": "Escribe tu mensaje...",
    "chat.send": "Enviar",
    "chat.thinking": "Pensando...",
    "chat.welcome": "¡Pregúntame lo que sea sobre Renegade Immortal!",
    "chat.delete_confirm": "¿Eliminar esta conversación?",
    "chat.rename": "Renombrar",
    "chat.created": "Creado",
    "chat.updated": "Actualizado",

    // Feed
    "feed.title": "Feed",
    "feed.new_post": "Nueva Publicación",
    "feed.no_posts": "Aún no hay publicaciones",
    "feed.write_something": "Escribe algo...",
    "feed.post": "Publicar",
    "feed.like": "Me gusta",
    "feed.comment": "Comentar",
    "feed.share": "Compartir",
    "feed.delete_post": "Eliminar Publicación",

    // Community
    "community.members": "Miembros",
    "community.online": "En línea",
    "community.join": "Unirse a la Comunidad",
    "community.leave": "Abandonar Comunidad",

    // Characters
    "characters.title": "Personajes",
    "characters.cultivation": "Cultivación",
    "characters.affiliation": "Afiliación",
    "characters.status": "Estado",
    "characters.debut": "Debut",
    "characters.allegiance": "Lealtad",

    // World
    "world.locations": "Ubicaciones",
    "world.realm": "Reino",
    "world.sect": "Secta",
    "world.cultivation": "Sistema de Cultivación",
    "world.artifacts": "Artefactos",

    // Guide
    "guide.beginners": "Guía para Principiantes",
    "guide.cultivation": "Guía de Cultivación",
    "guide.timeline": "Línea de Tiempo",
    "guide.faq": "Preguntas Frecuentes",

    // Errors
    "error.generic": "Algo salió mal",
    "error.not_found": "Página no encontrada",
    "error.no_connection": "Sin conexión",
    "error.try_again": "Por favor, inténtalo de nuevo",
  },

  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.guide": "Guide",
    "nav.characters": "Personnages",
    "nav.world": "Monde",
    "nav.more": "Plus",
    "nav.community": "Communauté",
    "nav.feed": "Fil",
    "nav.voidy": "Voidy",
    "nav.messages": "Messages",
    "nav.groups": "Groupes",
    "nav.watch": "Regarder",
    "nav.ai_chat": "Chat IA",

    // Common
    "common.search": "Rechercher",
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.retry": "Réessayer",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.close": "Fermer",
    "common.open": "Ouvrir",
    "common.view": "Voir",
    "common.read_more": "Lire la suite",
    "common.show_less": "Afficher moins",
    "common.prev": "Préc",
    "common.next": "Suiv",
    "common.unknown": "Inconnu",
    "common.all": "Tous",
    "common.none": "Aucun",
    "common.filter": "Filtrer",
    "common.sort": "Trier",
    "common.newest": "Plus récent",
    "common.oldest": "Plus ancien",

    // Watch Page
    "watch.now_playing": "LECTURE EN COURS",
    "watch.episodes": "Épisodes",
    "watch.episode": "Épisode",
    "watch.season": "Saison",
    "watch.servers": "Serveurs",
    "watch.sources": "Sources",
    "watch.show_sources": "Afficher les liens sources",
    "watch.hide_sources": "Masquer les liens sources",
    "watch.watch_on": "Regarder sur les sites sources:",
    "watch.next_episode": "Prochain épisode",
    "watch.released": "Sorti",
    "watch.unknown_release": "Date de sortie inconnue",
    "watch.episode_count": "{count} épisodes",
    "watch.airing": "En cours",
    "watch.completed": "Terminé",
    "watch.rating": "Note",
    "watch.duration": "Durée",
    "watch.studio": "Studio",
    "watch.genres": "Genres",

    // AI Chat
    "chat.new_conversation": "Nouvelle Conversation",
    "chat.conversations": "Conversations",
    "chat.no_conversations": "Aucune conversation pour l'instant",
    "chat.message_placeholder": "Tapez votre message...",
    "chat.send": "Envoyer",
    "chat.thinking": "Réflexion...",
    "chat.welcome": "Demandez-moi n'importe quoi sur Renegade Immortal !",
    "chat.delete_confirm": "Supprimer cette conversation ?",
    "chat.rename": "Renommer",
    "chat.created": "Créé",
    "chat.updated": "Mis à jour",

    // Feed
    "feed.title": "Fil",
    "feed.new_post": "Nouvelle Publication",
    "feed.no_posts": "Aucune publication pour l'instant",
    "feed.write_something": "Écrivez quelque chose...",
    "feed.post": "Publier",
    "feed.like": "J'aime",
    "feed.comment": "Commenter",
    "feed.share": "Partager",
    "feed.delete_post": "Supprimer la Publication",

    // Community
    "community.members": "Membres",
    "community.online": "En ligne",
    "community.join": "Rejoindre la Communauté",
    "community.leave": "Quitter la Communauté",

    // Characters
    "characters.title": "Personnages",
    "characters.cultivation": "Cultivation",
    "characters.affiliation": "Affiliation",
    "characters.status": "Statut",
    "characters.debut": "Début",
    "characters.allegiance": "Allégeance",

    // World
    "world.locations": "Lieux",
    "world.realm": "Royaume",
    "world.sect": "Secte",
    "world.cultivation": "Système de Cultivation",
    "world.artifacts": "Artefacts",

    // Guide
    "guide.beginners": "Guide du Débutant",
    "guide.cultivation": "Guide de Cultivation",
    "guide.timeline": "Chronologie",
    "guide.faq": "FAQ",

    // Errors
    "error.generic": "Quelque chose s'est mal passé",
    "error.not_found": "Page non trouvée",
    "error.no_connection": "Pas de connexion",
    "error.try_again": "Veuillez réessayer",
  },

  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.guide": "الدليل",
    "nav.characters": "الشخصيات",
    "nav.world": "العالم",
    "nav.more": "المزيد",
    "nav.community": "المجتمع",
    "nav.feed": "الأخبار",
    "nav.voidy": "Voidy",
    "nav.messages": "الرسائل",
    "nav.groups": "المجموعات",
    "nav.watch": "مشاهدة",
    "nav.ai_chat": "دردشة AI",

    // Common
    "common.search": "بحث",
    "common.loading": "جاري التحميل...",
    "common.error": "خطأ",
    "common.retry": "إعادة المحاولة",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.delete": "حذف",
    "common.edit": "تعديل",
    "common.close": "إغلاق",
    "common.open": "فتح",
    "common.view": "عرض",
    "common.read_more": "قراءة المزيد",
    "common.show_less": "عرض أقل",
    "common.prev": "السابق",
    "common.next": "التالي",
    "common.unknown": "غير معروف",
    "common.all": "الكل",
    "common.none": "لا شيء",
    "common.filter": "تصفية",
    "common.sort": "ترتيب",
    "common.newest": "الأحدث",
    "common.oldest": "الأقدم",

    // Watch Page
    "watch.now_playing": "جاري التشغيل",
    "watch.episodes": "الحلقات",
    "watch.episode": "حلقة",
    "watch.season": "الموسم",
    "watch.servers": "الخوادم",
    "watch.sources": "المصادر",
    "watch.show_sources": "إظهار روابط المصادر",
    "watch.hide_sources": "إخفاء روابط المصادر",
    "watch.watch_on": "مشاهدة على مواقع المصادر:",
    "watch.next_episode": "الحلقة التالية",
    "watch.released": "تم الإصدار",
    "watch.unknown_release": "تاريخ الإصدار غير معروف",
    "watch.episode_count": "{count} حلقة",
    "watch.airing": "يُعرض الآن",
    "watch.completed": "مكتمل",
    "watch.rating": "التقييم",
    "watch.duration": "المدة",
    "watch.studio": "الاستوديو",
    "watch.genres": "التصنيفات",

    // AI Chat
    "chat.new_conversation": "محادثة جديدة",
    "chat.conversations": "المحادثات",
    "chat.no_conversations": "لا توجد محادثات بعد",
    "chat.message_placeholder": "اكتب رسالتك...",
    "chat.send": "إرسال",
    "chat.thinking": "جاري التفكير...",
    "chat.welcome": "اسألني أي شيء عن Renegade Immortal!",
    "chat.delete_confirm": "حذف هذه المحادثة؟",
    "chat.rename": "إعادة التسمية",
    "chat.created": "تم الإنشاء",
    "chat.updated": "تم التحديث",

    // Feed
    "feed.title": "الأخبار",
    "feed.new_post": "منشور جديد",
    "feed.no_posts": "لا توجد منشورات بعد",
    "feed.write_something": "اكتب شيئاً...",
    "feed.post": "نشر",
    "feed.like": "إعجاب",
    "feed.comment": "تعليق",
    "feed.share": "مشاركة",
    "feed.delete_post": "حذف المنشور",

    // Community
    "community.members": "الأعضاء",
    "community.online": "متصل",
    "community.join": "انضمام للمجتمع",
    "community.leave": "مغادرة المجتمع",

    // Characters
    "characters.title": "الشخصيات",
    "characters.cultivation": "الت cultivating",
    "characters.affiliation": "الانتماء",
    "characters.status": "الحالة",
    "characters.debut": "أول ظهور",
    "characters.allegiance": "الولاء",

    // World
    "world.locations": "المواقع",
    "world.realm": "العالم",
    "world.sect": "الطائفة",
    "world.cultivation": "نظام الت cultivating",
    "world.artifacts": "الأدوات",

    // Guide
    "guide.beginners": "دليل المبتدئين",
    "guide.cultivation": "دليل الت cultivating",
    "guide.timeline": "الخط الزمني",
    "guide.faq": "الأسئلة الشائعة",

    // Errors
    "error.generic": "حدث خطأ ما",
    "error.not_found": "الصفحة غير موجودة",
    "error.no_connection": "لا يوجد اتصال",
    "error.try_again": "يرجى المحاولة مرة أخرى",
  },

  pt: {
    // Navigation
    "nav.home": "Início",
    "nav.guide": "Guia",
    "nav.characters": "Personagens",
    "nav.world": "Mundo",
    "nav.more": "Mais",
    "nav.community": "Comunidade",
    "nav.feed": "Feed",
    "nav.voidy": "Voidy",
    "nav.messages": "Mensagens",
    "nav.groups": "Grupos",
    "nav.watch": "Assistir",
    "nav.ai_chat": "Chat IA",

    // Common
    "common.search": "Buscar",
    "common.loading": "Carregando...",
    "common.error": "Erro",
    "common.retry": "Tentar novamente",
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.delete": "Excluir",
    "common.edit": "Editar",
    "common.close": "Fechar",
    "common.open": "Abrir",
    "common.view": "Ver",
    "common.read_more": "Ler mais",
    "common.show_less": "Mostrar menos",
    "common.prev": "Anterior",
    "common.next": "Próximo",
    "common.unknown": "Desconhecido",
    "common.all": "Todos",
    "common.none": "Nenhum",
    "common.filter": "Filtrar",
    "common.sort": "Ordenar",
    "common.newest": "Mais recente",
    "common.oldest": "Mais antigo",

    // Watch Page
    "watch.now_playing": "REPRODUZINDO AGORA",
    "watch.episodes": "Episódios",
    "watch.episode": "Episódio",
    "watch.season": "Temporada",
    "watch.servers": "Servidores",
    "watch.sources": "Fontes",
    "watch.show_sources": "Mostrar links das fontes",
    "watch.hide_sources": "Ocultar links das fontes",
    "watch.watch_on": "Assistir nos sites de origem:",
    "watch.next_episode": "Próximo episódio",
    "watch.released": "Lançado",
    "watch.unknown_release": "Data de lançamento desconhecida",
    "watch.episode_count": "{count} episódios",
    "watch.airing": "Em exibição",
    "watch.completed": "Concluído",
    "watch.rating": "Avaliação",
    "watch.duration": "Duração",
    "watch.studio": "Estúdio",
    "watch.genres": "Gêneros",

    // AI Chat
    "chat.new_conversation": "Nova Conversa",
    "chat.conversations": "Conversas",
    "chat.no_conversations": "Nenhuma conversa ainda",
    "chat.message_placeholder": "Digite sua mensagem...",
    "chat.send": "Enviar",
    "chat.thinking": "Pensando...",
    "chat.welcome": "Pergunte-me qualquer coisa sobre Renegade Immortal!",
    "chat.delete_confirm": "Excluir esta conversa?",
    "chat.rename": "Renomear",
    "chat.created": "Criado",
    "chat.updated": "Atualizado",

    // Feed
    "feed.title": "Feed",
    "feed.new_post": "Nova Publicação",
    "feed.no_posts": "Nenhuma publicação ainda",
    "feed.write_something": "Escreva algo...",
    "feed.post": "Publicar",
    "feed.like": "Curtir",
    "feed.comment": "Comentar",
    "feed.share": "Compartilhar",
    "feed.delete_post": "Excluir Publicação",

    // Community
    "community.members": "Membros",
    "community.online": "Online",
    "community.join": "Entrar na Comunidade",
    "community.leave": "Sair da Comunidade",

    // Characters
    "characters.title": "Personagens",
    "characters.cultivation": "Cultivação",
    "characters.affiliation": "Afiliação",
    "characters.status": "Status",
    "characters.debut": "Estreia",
    "characters.allegiance": "Lealdade",

    // World
    "world.locations": "Locais",
    "world.realm": "Reino",
    "world.sect": "Seita",
    "world.cultivation": "Sistema de Cultivação",
    "world.artifacts": "Artefatos",

    // Guide
    "guide.beginners": "Guia para Iniciantes",
    "guide.cultivation": "Guia de Cultivação",
    "guide.timeline": "Linha do Tempo",
    "guide.faq": "FAQ",

    // Errors
    "error.generic": "Algo deu errado",
    "error.not_found": "Página não encontrada",
    "error.no_connection": "Sem conexão",
    "error.try_again": "Por favor, tente novamente",
  },

  de: {
    // Navigation
    "nav.home": "Startseite",
    "nav.guide": "Anleitung",
    "nav.characters": "Charaktere",
    "nav.world": "Welt",
    "nav.more": "Mehr",
    "nav.community": "Community",
    "nav.feed": "Feed",
    "nav.voidy": "Voidy",
    "nav.messages": "Nachrichten",
    "nav.groups": "Gruppen",
    "nav.watch": "Ansehen",
    "nav.ai_chat": "AI Chat",

    // Common
    "common.search": "Suchen",
    "common.loading": "Wird geladen...",
    "common.error": "Fehler",
    "common.retry": "Wiederholen",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.delete": "Löschen",
    "common.edit": "Bearbeiten",
    "common.close": "Schließen",
    "common.open": "Öffnen",
    "common.view": "Ansehen",
    "common.read_more": "Mehr lesen",
    "common.show_less": "Weniger anzeigen",
    "common.prev": "Zurück",
    "common.next": "Weiter",
    "common.unknown": "Unbekannt",
    "common.all": "Alle",
    "common.none": "Keine",
    "common.filter": "Filtern",
    "common.sort": "Sortieren",
    "common.newest": "Neueste",
    "common.oldest": "Älteste",

    // Watch Page
    "watch.now_playing": "JETZT ABGESPIELT",
    "watch.episodes": "Episoden",
    "watch.episode": "Episode",
    "watch.season": "Staffel",
    "watch.servers": "Server",
    "watch.sources": "Quellen",
    "watch.show_sources": "Quellenlinks anzeigen",
    "watch.hide_sources": "Quellenlinks ausblenden",
    "watch.watch_on": "Auf Quellseiten ansehen:",
    "watch.next_episode": "Nächste Episode",
    "watch.released": "Veröffentlicht",
    "watch.unknown_release": "Unbekanntes Veröffentlichungsdatum",
    "watch.episode_count": "{count} Episoden",
    "watch.airing": "Wird ausgestrahlt",
    "watch.completed": "Abgeschlossen",
    "watch.rating": "Bewertung",
    "watch.duration": "Dauer",
    "watch.studio": "Studio",
    "watch.genres": "Genres",

    // AI Chat
    "chat.new_conversation": "Neues Gespräch",
    "chat.conversations": "Gespräche",
    "chat.no_conversations": "Noch keine Gespräche",
    "chat.message_placeholder": "Nachricht eingeben...",
    "chat.send": "Senden",
    "chat.thinking": "Denke nach...",
    "chat.welcome": "Frag mich alles über Renegade Immortal!",
    "chat.delete_confirm": "Dieses Gespräch löschen?",
    "chat.rename": "Umbenennen",
    "chat.created": "Erstellt",
    "chat.updated": "Aktualisiert",

    // Feed
    "feed.title": "Feed",
    "feed.new_post": "Neuer Beitrag",
    "feed.no_posts": "Noch keine Beiträge",
    "feed.write_something": "Schreibe etwas...",
    "feed.post": "Posten",
    "feed.like": "Gefällt mir",
    "feed.comment": "Kommentieren",
    "feed.share": "Teilen",
    "feed.delete_post": "Beitrag löschen",

    // Community
    "community.members": "Mitglieder",
    "community.online": "Online",
    "community.join": "Community beitreten",
    "community.leave": "Community verlassen",

    // Characters
    "characters.title": "Charaktere",
    "characters.cultivation": "Kultivierung",
    "characters.affiliation": "Zugehörigkeit",
    "characters.status": "Status",
    "characters.debut": "Debüt",
    "characters.allegiance": "Treue",

    // World
    "world.locations": "Orte",
    "world.realm": "Reich",
    "world.sect": "Sekte",
    "world.cultivation": "Kultivierungssystem",
    "world.artifacts": "Artefakte",

    // Guide
    "guide.beginners": "Anleitung für Anfänger",
    "guide.cultivation": "Kultivierungsanleitung",
    "guide.timeline": "Zeitlinie",
    "guide.faq": "FAQ",

    // Errors
    "error.generic": "Etwas ist schiefgelaufen",
    "error.not_found": "Seite nicht gefunden",
    "error.no_connection": "Keine Verbindung",
    "error.try_again": "Bitte versuche es erneut",
  },

  ja: {
    // Navigation
    "nav.home": "ホーム",
    "nav.guide": "ガイド",
    "nav.characters": "キャラクター",
    "nav.world": "世界",
    "nav.more": "その他",
    "nav.community": "コミュニティ",
    "nav.feed": "フィード",
    "nav.voidy": "Voidy",
    "nav.messages": "メッセージ",
    "nav.groups": "グループ",
    "nav.watch": "視聴",
    "nav.ai_chat": "AIチャット",

    // Common
    "common.search": "検索",
    "common.loading": "読み込み中...",
    "common.error": "エラー",
    "common.retry": "再試行",
    "common.save": "保存",
    "common.cancel": "キャンセル",
    "common.delete": "削除",
    "common.edit": "編集",
    "common.close": "閉じる",
    "common.open": "開く",
    "common.view": "表示",
    "common.read_more": "続きを読む",
    "common.show_less": "表示を減らす",
    "common.prev": "前へ",
    "common.next": "次へ",
    "common.unknown": "不明",
    "common.all": "すべて",
    "common.none": "なし",
    "common.filter": "フィルター",
    "common.sort": "並べ替え",
    "common.newest": "最新",
    "common.oldest": "最古",

    // Watch Page
    "watch.now_playing": "再生中",
    "watch.episodes": "エピソード",
    "watch.episode": "話",
    "watch.season": "シーズン",
    "watch.servers": "サーバー",
    "watch.sources": "ソース",
    "watch.show_sources": "ソースリンクを表示",
    "watch.hide_sources": "ソースリンクを隠す",
    "watch.watch_on": "ソースサイトで視聴:",
    "watch.next_episode": "次のエピソード",
    "watch.released": "公開済み",
    "watch.unknown_release": "公開日不明",
    "watch.episode_count": "{count}話",
    "watch.airing": "放送中",
    "watch.completed": "完結",
    "watch.rating": "評価",
    "watch.duration": "再生時間",
    "watch.studio": "スタジオ",
    "watch.genres": "ジャンル",

    // AI Chat
    "chat.new_conversation": "新しい会話",
    "chat.conversations": "会話一覧",
    "chat.no_conversations": "会話はまだありません",
    "chat.message_placeholder": "メッセージを入力...",
    "chat.send": "送信",
    "chat.thinking": "考え中...",
    "chat.welcome": "仙逆について何でも聞いてください！",
    "chat.delete_confirm": "この会話を削除しますか？",
    "chat.rename": "名前を変更",
    "chat.created": "作成日",
    "chat.updated": "更新日",

    // Feed
    "feed.title": "フィード",
    "feed.new_post": "新規投稿",
    "feed.no_posts": "投稿はまだありません",
    "feed.write_something": "何か書いてください...",
    "feed.post": "投稿",
    "feed.like": "いいね",
    "feed.comment": "コメント",
    "feed.share": "共有",
    "feed.delete_post": "投稿を削除",

    // Community
    "community.members": "メンバー",
    "community.online": "オンライン",
    "community.join": "コミュニティに参加",
    "community.leave": "コミュニティを退会",

    // Characters
    "characters.title": "キャラクター",
    "characters.cultivation": "修行",
    "characters.affiliation": "所属",
    "characters.status": "状態",
    "characters.debut": "初登場",
    "characters.allegiance": "忠誠",

    // World
    "world.locations": "場所",
    "world.realm": "境界",
    "world.sect": "宗派",
    "world.cultivation": "修行システム",
    "world.artifacts": "法宝",

    // Guide
    "guide.beginners": "初心者ガイド",
    "guide.cultivation": "修行ガイド",
    "guide.timeline": "年表",
    "guide.faq": "よくある質問",

    // Errors
    "error.generic": "エラーが発生しました",
    "error.not_found": "ページが見つかりません",
    "error.no_connection": "接続がありません",
    "error.try_again": "もう一度お試しください",
  },

  ko: {
    // Navigation
    "nav.home": "홈",
    "nav.guide": "가이드",
    "nav.characters": "캐릭터",
    "nav.world": "세계",
    "nav.more": "더보기",
    "nav.community": "커뮤니티",
    "nav.feed": "피드",
    "nav.voidy": "Voidy",
    "nav.messages": "메시지",
    "nav.groups": "그룹",
    "nav.watch": "시청",
    "nav.ai_chat": "AI 채팅",

    // Common
    "common.search": "검색",
    "common.loading": "로딩 중...",
    "common.error": "오류",
    "common.retry": "다시 시도",
    "common.save": "저장",
    "common.cancel": "취소",
    "common.delete": "삭제",
    "common.edit": "편집",
    "common.close": "닫기",
    "common.open": "열기",
    "common.view": "보기",
    "common.read_more": "더 읽기",
    "common.show_less": "덜 보기",
    "common.prev": "이전",
    "common.next": "다음",
    "common.unknown": "알 수 없음",
    "common.all": "모두",
    "common.none": "없음",
    "common.filter": "필터",
    "common.sort": "정렬",
    "common.newest": "최신",
    "common.oldest": "오래된",

    // Watch Page
    "watch.now_playing": "지금 재생 중",
    "watch.episodes": "에피소드",
    "watch.episode": "화",
    "watch.season": "시즌",
    "watch.servers": "서버",
    "watch.sources": "소스",
    "watch.show_sources": "소스 링크 표시",
    "watch.hide_sources": "소스 링크 숨기기",
    "watch.watch_on": "소스 사이트에서 시청:",
    "watch.next_episode": "다음 에피소드",
    "watch.released": "공개됨",
    "watch.unknown_release": "공개일 알 수 없음",
    "watch.episode_count": "{count}화",
    "watch.airing": "방영 중",
    "watch.completed": "완결",
    "watch.rating": "평점",
    "watch.duration": "재생 시간",
    "watch.studio": "스튜디오",
    "watch.genres": "장르",

    // AI Chat
    "chat.new_conversation": "새 대화",
    "chat.conversations": "대화 목록",
    "chat.no_conversations": "대화가 아직 없습니다",
    "chat.message_placeholder": "메시지를 입력하세요...",
    "chat.send": "보내기",
    "chat.thinking": "생각 중...",
    "chat.welcome": "仙逆에 대해 무엇이든 물어보세요!",
    "chat.delete_confirm": "이 대화를 삭제하시겠습니까?",
    "chat.rename": "이름 변경",
    "chat.created": "생성일",
    "chat.updated": "업데이트일",

    // Feed
    "feed.title": "피드",
    "feed.new_post": "새 게시물",
    "feed.no_posts": "게시물이 아직 없습니다",
    "feed.write_something": "무엇인가를 작성하세요...",
    "feed.post": "게시",
    "feed.like": "좋아요",
    "feed.comment": "댓글",
    "feed.share": "공유",
    "feed.delete_post": "게시물 삭제",

    // Community
    "community.members": "회원",
    "community.online": "온라인",
    "community.join": "커뮤니티 가입",
    "community.leave": "커뮤니티 탈퇴",

    // Characters
    "characters.title": "캐릭터",
    "characters.cultivation": "수련",
    "characters.affiliation": "소속",
    "characters.status": "상태",
    "characters.debut": "첫 등장",
    "characters.allegiance": "충성",

    // World
    "world.locations": "장소",
    "world.realm": "경계",
    "world.sect": "종파",
    "world.cultivation": "수련 시스템",
    "world.artifacts": "법보",

    // Guide
    "guide.beginners": "초보자 가이드",
    "guide.cultivation": "수련 가이드",
    "guide.timeline": "타임라인",
    "guide.faq": "자주 묻는 질문",

    // Errors
    "error.generic": "문제가 발생했습니다",
    "error.not_found": "페이지를 찾을 수 없습니다",
    "error.no_connection": "연결 없음",
    "error.try_again": "다시 시도해 주세요",
  },

  ru: {
    // Navigation
    "nav.home": "Главная",
    "nav.guide": "Руководство",
    "nav.characters": "Персонажи",
    "nav.world": "Мир",
    "nav.more": "Ещё",
    "nav.community": "Сообщество",
    "nav.feed": "Лента",
    "nav.voidy": "Voidy",
    "nav.messages": "Сообщения",
    "nav.groups": "Группы",
    "nav.watch": "Смотреть",
    "nav.ai_chat": "AI Чат",

    // Common
    "common.search": "Поиск",
    "common.loading": "Загрузка...",
    "common.error": "Ошибка",
    "common.retry": "Повторить",
    "common.save": "Сохранить",
    "common.cancel": "Отмена",
    "common.delete": "Удалить",
    "common.edit": "Редактировать",
    "common.close": "Закрыть",
    "common.open": "Открыть",
    "common.view": "Просмотр",
    "common.read_more": "Читать далее",
    "common.show_less": "Свернуть",
    "common.prev": "Назад",
    "common.next": "Вперёд",
    "common.unknown": "Неизвестно",
    "common.all": "Все",
    "common.none": "Нет",
    "common.filter": "Фильтр",
    "common.sort": "Сортировка",
    "common.newest": "Новые",
    "common.oldest": "Старые",

    // Watch Page
    "watch.now_playing": "СЕЙЧАС ИГРАЕТ",
    "watch.episodes": "Эпизоды",
    "watch.episode": "Эпизод",
    "watch.season": "Сезон",
    "watch.servers": "Серверы",
    "watch.sources": "Источники",
    "watch.show_sources": "Показать ссылки источников",
    "watch.hide_sources": "Скрыть ссылки источников",
    "watch.watch_on": "Смотреть на исходных сайтах:",
    "watch.next_episode": "Следующий эпизод",
    "watch.released": "Выпущено",
    "watch.unknown_release": "Дата выпуска неизвестна",
    "watch.episode_count": "{count} эпизодов",
    "watch.airing": "Выходит",
    "watch.completed": "Завершено",
    "watch.rating": "Рейтинг",
    "watch.duration": "Длительность",
    "watch.studio": "Студия",
    "watch.genres": "Жанры",

    // AI Chat
    "chat.new_conversation": "Новый разговор",
    "chat.conversations": "Разговоры",
    "chat.no_conversations": "Пока нет разговоров",
    "chat.message_placeholder": "Введите сообщение...",
    "chat.send": "Отправить",
    "chat.thinking": "Думаю...",
    "chat.welcome": "Спросите меня что угодно о Renegade Immortal!",
    "chat.delete_confirm": "Удалить этот разговор?",
    "chat.rename": "Переименовать",
    "chat.created": "Создано",
    "chat.updated": "Обновлено",

    // Feed
    "feed.title": "Лента",
    "feed.new_post": "Новый пост",
    "feed.no_posts": "Пока нет постов",
    "feed.write_something": "Напишите что-нибудь...",
    "feed.post": "Опубликовать",
    "feed.like": "Нравится",
    "feed.comment": "Комментарий",
    "feed.share": "Поделиться",
    "feed.delete_post": "Удалить пост",

    // Community
    "community.members": "Участники",
    "community.online": "Онлайн",
    "community.join": "Присоединиться к сообществу",
    "community.leave": "Покинуть сообщество",

    // Characters
    "characters.title": "Персонажи",
    "characters.cultivation": "Культивация",
    "characters.affiliation": "Принадлежность",
    "characters.status": "Статус",
    "characters.debut": "Дебют",
    "characters.allegiance": "Верность",

    // World
    "world.locations": "Места",
    "world.realm": "Мир",
    "world.sect": "Секта",
    "world.cultivation": "Система культивации",
    "world.artifacts": "Артефакты",

    // Guide
    "guide.beginners": "Руководство для начинающих",
    "guide.cultivation": "Руководство по культивации",
    "guide.timeline": "Хронология",
    "guide.faq": "Частые вопросы",

    // Errors
    "error.generic": "Что-то пошло не так",
    "error.not_found": "Страница не найдена",
    "error.no_connection": "Нет подключения",
    "error.try_again": "Пожалуйста, попробуйте снова",
  },

  hi: {
    // Navigation
    "nav.home": "होम",
    "nav.guide": "गाइड",
    "nav.characters": "पात्र",
    "nav.world": "दुनिया",
    "nav.more": "अधिक",
    "nav.community": "समुदाय",
    "nav.feed": "फीड",
    "nav.voidy": "Voidy",
    "nav.messages": "संदेश",
    "nav.groups": "समूह",
    "nav.watch": "देखें",
    "nav.ai_chat": "AI चैट",

    // Common
    "common.search": "खोजें",
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि",
    "common.retry": "पुनः प्रयास करें",
    "common.save": "सहेजें",
    "common.cancel": "रद्द करें",
    "common.delete": "हटाएं",
    "common.edit": "संपादित करें",
    "common.close": "बंद करें",
    "common.open": "खोलें",
    "common.view": "देखें",
    "common.read_more": "और पढ़ें",
    "common.show_less": "कम दिखाएं",
    "common.prev": "पिछला",
    "common.next": "अगला",
    "common.unknown": "अज्ञात",
    "common.all": "सभी",
    "common.none": "कोई नहीं",
    "common.filter": "फ़िल्टर",
    "common.sort": "क्रमबद्ध करें",
    "common.newest": "नवीनतम",
    "common.oldest": "सबसे पुराना",

    // Watch Page
    "watch.now_playing": "अभी चल रहा है",
    "watch.episodes": "एपिसोड",
    "watch.episode": "एपिसोड",
    "watch.season": "सीज़न",
    "watch.servers": "सर्वर",
    "watch.sources": "स्रोत",
    "watch.show_sources": "स्रोत लिंक दिखाएं",
    "watch.hide_sources": "स्रोत लिंक छुपाएं",
    "watch.watch_on": "स्रोत साइटों पर देखें:",
    "watch.next_episode": "अगला एपिसोड",
    "watch.released": "जारी किया गया",
    "watch.unknown_release": "जारी होने की तारीख अज्ञात",
    "watch.episode_count": "{count} एपिसोड",
    "watch.airing": "प्रसारित हो रहा है",
    "watch.completed": "पूर्ण",
    "watch.rating": "रेटिंग",
    "watch.duration": "अवधि",
    "watch.studio": "स्टूडियो",
    "watch.genres": "श्रेणियां",

    // AI Chat
    "chat.new_conversation": "नई बातचीत",
    "chat.conversations": "बातचीत",
    "chat.no_conversations": "अभी तक कोई बातचीत नहीं",
    "chat.message_placeholder": "अपना संदेश लिखें...",
    "chat.send": "भेजें",
    "chat.thinking": "सोच रहा है...",
    "chat.welcome": "Renegade Immortal के बारे में कुछ भी पूछें!",
    "chat.delete_confirm": "यह बातचीत हटाएं?",
    "chat.rename": "नाम बदलें",
    "chat.created": "बनाया गया",
    "chat.updated": "अपडेट किया गया",

    // Feed
    "feed.title": "फीड",
    "feed.new_post": "नई पोस्ट",
    "feed.no_posts": "अभी तक कोई पोस्ट नहीं",
    "feed.write_something": "कुछ लिखें...",
    "feed.post": "पोस्ट करें",
    "feed.like": "पसंद करें",
    "feed.comment": "टिप्पणी",
    "feed.share": "साझा करें",
    "feed.delete_post": "पोस्ट हटाएं",

    // Community
    "community.members": "सदस्य",
    "community.online": "ऑनलाइन",
    "community.join": "समुदाय में शामिल हों",
    "community.leave": "समुदाय छोड़ें",

    // Characters
    "characters.title": "पात्र",
    "characters.cultivation": "साधना",
    "characters.affiliation": "संबद्धता",
    "characters.status": "स्थिति",
    "characters.debut": "पहली बार",
    "characters.allegiance": "निष्ठा",

    // World
    "world.locations": "स्थान",
    "world.realm": "क्षेत्र",
    "world.sect": "संप्रदाय",
    "world.cultivation": "साधना प्रणाली",
    "world.artifacts": "कलाकृतियां",

    // Guide
    "guide.beginners": "शुरुआती गाइड",
    "guide.cultivation": "साधना गाइड",
    "guide.timeline": "समयरेखा",
    "guide.faq": "सामान्य प्रश्न",

    // Errors
    "error.generic": "कुछ गलत हो गया",
    "error.not_found": "पेज नहीं मिला",
    "error.no_connection": "कोई कनेक्शन नहीं",
    "error.try_again": "कृपया पुनः प्रयास करें",
  },
};

// Supported languages
export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
];

// Detect browser language
function detectBrowserLanguage(): string {
  if (typeof navigator === "undefined") return "en";

  // Get browser languages
  const browserLangs = navigator.languages || [navigator.language];

  // Find first supported language
  for (const lang of browserLangs) {
    const code = lang.split("-")[0].toLowerCase();
    if (translations[code]) {
      return code;
    }
  }

  return "en";
}

// Get saved language from localStorage
function getSavedLanguage(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem("app-language");
}

// Save language to localStorage
function saveLanguage(code: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("app-language", code);
}

export function useTranslation() {
  const [language, setLanguageState] = useState<string>(() => {
    return getSavedLanguage() || detectBrowserLanguage();
  });

  const setLanguage = useCallback((code: string) => {
    if (translations[code]) {
      setLanguageState(code);
      saveLanguage(code);
    }
  }, []);

  // Translate function
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const translation = translations[language]?.[key] || translations["en"]?.[key] || key;

      if (params) {
        return Object.entries(params).reduce(
          (acc, [paramKey, value]) => acc.replace(`{${paramKey}}`, String(value)),
          translation
        );
      }

      return translation;
    },
    [language]
  );

  // Get current language info
  const currentLanguage = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  return {
    t,
    language,
    setLanguage,
    currentLanguage,
    supportedLanguages,
    isRTL: language === "ar",
  };
}

// Simple translation component for use outside React components
export function translate(key: string, lang: string = "en", params?: Record<string, string | number>): string {
  const translation = translations[lang]?.[key] || translations["en"]?.[key] || key;

  if (params) {
    return Object.entries(params).reduce(
      (acc, [paramKey, value]) => acc.replace(`{${paramKey}}`, String(value)),
      translation
    );
  }

  return translation;
}
