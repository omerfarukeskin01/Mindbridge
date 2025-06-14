const Resource = require('../models/Resource');
const moment = require('moment');

class ResourceController {
    // Ana kaynak kütüphanesi sayfası
    static async getResourceLibrary(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 12;
            const skip = (page - 1) * limit;
            const category = req.query.category;
            const search = req.query.search;

            // Filtre oluştur
            const filter = { isPublished: true };
            if (category && category !== 'all') {
                filter.category = category;
            }
            if (search) {
                filter.$text = { $search: search };
            }

            // Kaynakları getir
            const resources = await Resource.find(filter)
                .populate('author', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            // Toplam sayfa sayısı
            const totalResources = await Resource.countDocuments(filter);
            const totalPages = Math.ceil(totalResources / limit);

            // Kategoriler
            const categories = [
                { value: 'all', label: 'Tümü', icon: 'fas fa-th-large' },
                { value: 'anksiyete', label: 'Anksiyete', icon: 'fas fa-heart-pulse' },
                { value: 'depresyon', label: 'Depresyon', icon: 'fas fa-cloud-rain' },
                { value: 'stres-yonetimi', label: 'Stres Yönetimi', icon: 'fas fa-leaf' },
                { value: 'iliskiler', label: 'İlişkiler', icon: 'fas fa-users' },
                { value: 'ozguven', label: 'Özgüven', icon: 'fas fa-star' },
                { value: 'uyku-problemleri', label: 'Uyku Problemleri', icon: 'fas fa-moon' },
                { value: 'ozbakım', label: 'Özbakım', icon: 'fas fa-spa' },
                { value: 'mindfulness', label: 'Mindfulness', icon: 'fas fa-om' },
                { value: 'genel-saglik', label: 'Genel Sağlık', icon: 'fas fa-heartbeat' },
                { value: 'diger', label: 'Diğer', icon: 'fas fa-ellipsis-h' }
            ];

            res.render('resources/library', {
                title: 'Kaynak Kütüphanesi',
                resources,
                categories,
                currentCategory: category || 'all',
                currentSearch: search || '',
                currentPage: page,
                totalPages,
                totalResources,
                moment
            });
        } catch (error) {
            console.error('Resource library error:', error);
            req.flash('error', 'Kaynak kütüphanesi yüklenirken bir hata oluştu');
            res.redirect('/dashboard');
        }
    }

    // Kaynak detay sayfası
    static async getResourceDetail(req, res) {
        try {
            const resourceId = req.params.id;
            
            // Kaynağı getir ve görüntülenme sayısını artır
            const resource = await Resource.findByIdAndUpdate(
                resourceId,
                { $inc: { viewCount: 1 } },
                { new: true }
            ).populate('author', 'name specialization');

            if (!resource || !resource.isPublished) {
                req.flash('error', 'Kaynak bulunamadı');
                return res.redirect('/resources');
            }

            // Kullanıcının bu kaynağı beğenip beğenmediğini kontrol et
            const isLiked = resource.likes.includes(req.session.user.id);

            // İlgili kaynaklar (aynı kategoriden)
            const relatedResources = await Resource.find({
                category: resource.category,
                _id: { $ne: resource._id },
                isPublished: true
            })
            .populate('author', 'name')
            .limit(4)
            .sort({ viewCount: -1 });

            res.render('resources/detail', {
                title: resource.title,
                resource,
                isLiked,
                relatedResources,
                moment
            });
        } catch (error) {
            console.error('Resource detail error:', error);
            req.flash('error', 'Kaynak yüklenirken bir hata oluştu');
            res.redirect('/resources');
        }
    }

    // Kaynak beğenme/beğenmeme
    static async toggleLike(req, res) {
        try {
            const resourceId = req.params.id;
            const userId = req.session.user.id;

            const resource = await Resource.findById(resourceId);
            if (!resource) {
                return res.status(404).json({ success: false, message: 'Kaynak bulunamadı' });
            }

            const isLiked = resource.likes.includes(userId);
            
            if (isLiked) {
                // Beğeniyi kaldır
                resource.likes.pull(userId);
            } else {
                // Beğeni ekle
                resource.likes.push(userId);
            }

            await resource.save();

            res.json({
                success: true,
                isLiked: !isLiked,
                likeCount: resource.likes.length
            });
        } catch (error) {
            console.error('Toggle like error:', error);
            res.status(500).json({ success: false, message: 'Bir hata oluştu' });
        }
    }

    // Admin: Kaynak oluşturma sayfası
    static async getCreateResource(req, res) {
        try {
            if (req.session.user.role !== 'admin' && req.session.user.role !== 'psychologist') {
                req.flash('error', 'Bu sayfaya erişim yetkiniz yok');
                return res.redirect('/dashboard');
            }

            const categories = [
                { value: 'anksiyete', label: 'Anksiyete' },
                { value: 'depresyon', label: 'Depresyon' },
                { value: 'stres-yonetimi', label: 'Stres Yönetimi' },
                { value: 'iliskiler', label: 'İlişkiler' },
                { value: 'ozguven', label: 'Özgüven' },
                { value: 'uyku-problemleri', label: 'Uyku Problemleri' },
                { value: 'ozbakım', label: 'Özbakım' },
                { value: 'mindfulness', label: 'Mindfulness' },
                { value: 'genel-saglik', label: 'Genel Sağlık' },
                { value: 'diger', label: 'Diğer' }
            ];

            res.render('resources/create', {
                title: 'Yeni Kaynak Oluştur',
                categories
            });
        } catch (error) {
            console.error('Get create resource error:', error);
            req.flash('error', 'Sayfa yüklenirken bir hata oluştu');
            res.redirect('/dashboard');
        }
    }

    // Admin: Kaynak oluşturma
    static async createResource(req, res) {
        try {
            if (req.session.user.role !== 'admin' && req.session.user.role !== 'psychologist') {
                req.flash('error', 'Bu işlemi yapma yetkiniz yok');
                return res.redirect('/dashboard');
            }

            const { title, content, summary, category, tags, readingTime } = req.body;

            // Tags'i array'e çevir
            const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

            const resource = new Resource({
                title,
                content,
                summary,
                category,
                tags: tagArray,
                readingTime: parseInt(readingTime) || 5,
                author: req.session.user.id
            });

            await resource.save();

            req.flash('success', 'Kaynak başarıyla oluşturuldu!');
            res.redirect(`/resources/${resource._id}`);
        } catch (error) {
            console.error('Create resource error:', error);
            req.flash('error', 'Kaynak oluşturulurken bir hata oluştu');
            res.redirect('/resources/create');
        }
    }

    // Admin: Kaynak yönetimi sayfası
    static async getManageResources(req, res) {
        try {
            if (req.session.user.role !== 'admin' && req.session.user.role !== 'psychologist') {
                req.flash('error', 'Bu sayfaya erişim yetkiniz yok');
                return res.redirect('/dashboard');
            }

            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            const filter = {};
            if (req.session.user.role === 'psychologist') {
                filter.author = req.session.user.id;
            }

            const resources = await Resource.find(filter)
                .populate('author', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalResources = await Resource.countDocuments(filter);
            const totalPages = Math.ceil(totalResources / limit);

            res.render('resources/manage', {
                title: 'Kaynak Yönetimi',
                resources,
                currentPage: page,
                totalPages,
                moment
            });
        } catch (error) {
            console.error('Manage resources error:', error);
            req.flash('error', 'Sayfa yüklenirken bir hata oluştu');
            res.redirect('/dashboard');
        }
    }
}

module.exports = ResourceController; 