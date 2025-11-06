import { useEffect, useState, useRef, useCallback } from 'react';
import { isLoggedIn } from '../services';
import { userService } from '../services/userService';

const WISHLIST_KEY = 'wishlistIds';

export const useWishlist = () => {
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      let ids = raw ? JSON.parse(raw) : [];
      // Migrate from legacy 'wishlist' (array of product objects)
      const legacy = localStorage.getItem('wishlist');
      if (legacy) {
        const legacyObjs = JSON.parse(legacy);
        const legacyIds = Array.isArray(legacyObjs) ? legacyObjs.map((p) => p?._id).filter(Boolean) : [];
        ids = Array.from(new Set([...(ids || []), ...legacyIds]));
        localStorage.removeItem('wishlist');
      }
      return ids;
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const syncTimeoutRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  // Load wishlist from backend on mount if logged in
  useEffect(() => {
    const loadWishlist = async () => {
      if (!isLoggedIn()) return;
      
      try {
        setIsLoading(true);
        const remote = await userService.getWishlist();
        const remoteIds = (remote?.data || remote || []).map((p) => String(p._id || p));
        
        setWishlistIds(remoteIds);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(remoteIds));
      } catch (error) {
        console.error('Load wishlist error:', error);
      } finally {
        setIsLoading(false);
        isInitialLoadRef.current = false;
      }
    };

    loadWishlist();

    // Listen for login events
    const handleLogin = () => {
      loadWishlist();
    };

    window.addEventListener('userLoggedIn', handleLogin);
    window.addEventListener('storage', (e) => {
      if (e.key === 'accessToken' && e.newValue && isLoggedIn()) {
        loadWishlist();
      }
    });

    return () => {
      window.removeEventListener('userLoggedIn', handleLogin);
    };
  }, []); // Chỉ chạy 1 lần khi mount

  // Sync to localStorage (debounced)
  useEffect(() => {
    if (isInitialLoadRef.current) return; // Skip sync during initial load
    
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
    
    // Dispatch event để các component khác (như Header) cập nhật
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
      detail: { count: wishlistIds.length, ids: wishlistIds } 
    }));
    
    // Debounce sync to backend
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    syncTimeoutRef.current = setTimeout(async () => {
      if (!isLoggedIn()) return;
      
      try {
        const remote = await userService.getWishlist();
        const remoteIds = (remote?.data || remote || []).map((p) => String(p._id || p));
        const localIds = (wishlistIds || []).map((id) => String(id));
        
        // Chỉ sync nếu có thay đổi
        const remoteSet = new Set(remoteIds);
        const localSet = new Set(localIds);
        
        if (remoteSet.size !== localSet.size || 
            ![...remoteSet].every(id => localSet.has(id))) {
          // Merge local and remote
          const merged = Array.from(new Set([...remoteIds, ...localIds]));
          // Apply diff
          const toAdd = merged.filter((id) => !remoteIds.includes(id));
          const toRemove = remoteIds.filter((id) => !merged.includes(id));
          
          await Promise.all([
            ...toAdd.map((id) => userService.addToWishlist(id).catch(() => null)),
            ...toRemove.map((id) => userService.removeFromWishlist(id).catch(() => null)),
          ]);
        }
      } catch (error) {
        console.error('Wishlist sync error:', error);
      }
    }, 1000); // Debounce 1 giây
    
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [wishlistIds]);

  const add = useCallback(async (productId) => {
    const idStr = String(productId);
    
    // Optimistic update
    setWishlistIds((prev) => {
      const prevStr = prev.map(id => String(id));
      if (prevStr.includes(idStr)) return prev; // Đã có rồi, không cần update
      return [...prev, idStr];
    });
    
    // Sync to backend immediately
    if (isLoggedIn()) {
      try { 
        await userService.addToWishlist(idStr);
      } catch (error) {
        console.error('Add to wishlist error:', error);
        // Rollback on error
        setWishlistIds((prev) => prev.filter((id) => String(id) !== idStr));
      }
    }
  }, []);

  const remove = useCallback(async (productId) => {
    const idStr = String(productId);
    
    // Optimistic update
    setWishlistIds((prev) => prev.filter((id) => String(id) !== idStr));
    
    // Sync to backend immediately
    if (isLoggedIn()) {
      try { 
        await userService.removeFromWishlist(idStr);
      } catch (error) {
        console.error('Remove from wishlist error:', error);
        // Rollback on error
        setWishlistIds((prev) => {
          const prevStr = prev.map(id => String(id));
          if (prevStr.includes(idStr)) return prev;
          return [...prev, idStr];
        });
      }
    }
  }, []);

  const toggle = useCallback(async (productId) => {
    const idStr = String(productId);
    const hasItem = wishlistIds.some((id) => String(id) === idStr);
    
    // Optimistic update
    setWishlistIds((prev) => {
      if (prev.some((id) => String(id) === idStr)) {
        return prev.filter((id) => String(id) !== idStr);
      } else {
        return [...prev, idStr];
      }
    });
    
    // Sync to backend immediately
    if (isLoggedIn()) {
      try {
        if (hasItem) {
          await userService.removeFromWishlist(idStr);
        } else {
          await userService.addToWishlist(idStr);
        }
      } catch (error) {
        console.error('Wishlist API error:', error);
        // Rollback on error
        setWishlistIds((prev) => {
          if (hasItem) {
            // Was removing, add back
            const prevStr = prev.map(id => String(id));
            if (prevStr.includes(idStr)) return prev;
            return [...prev, idStr];
          } else {
            // Was adding, remove
            return prev.filter((id) => String(id) !== idStr);
          }
        });
      }
    }
  }, [wishlistIds]);

  const has = useCallback((productId) => {
    const idStr = String(productId);
    return wishlistIds.some((id) => String(id) === idStr);
  }, [wishlistIds]);

  const refresh = useCallback(async () => {
    if (!isLoggedIn()) return;
    
    try {
      setIsLoading(true);
      const remote = await userService.getWishlist();
      const remoteIds = (remote?.data || remote || []).map((p) => String(p._id || p));
      setWishlistIds(remoteIds);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(remoteIds));
    } catch (error) {
      console.error('Refresh wishlist error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { wishlistIds, add, remove, toggle, has, isLoading, refresh };
};


