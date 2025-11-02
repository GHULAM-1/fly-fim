"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Cross,
  CrossIcon,
  Plus,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCities, createCity } from "@/api/cities/cities-api";
import { City, CityResponse } from "@/types/cities/cities-types";
import { fetchCategories } from "@/api/category/category-api";
import { Category } from "@/types/category/category-types";
import {
  fetchSubcategories,
  createSubcategory,
  Subcategory,
} from "@/api/subcategory/subcategory-api";
import {
  validateImageFile,
  createImagePreview,
  revokeImagePreview,
} from "@/lib/utils/imageUploader";
import {
  cityFormSchema,
  CityFormData,
} from "@/lib/validations/city-validation";
import {
  subcategoryFormSchema,
  SubcategoryFormData,
} from "@/lib/validations/subcategory-validation";
import {
  experienceFormSchema,
  ExperienceFormData,
} from "@/lib/validations/experience-validation";
import { createExperience, updateExperience } from "@/api/expereince/expereince-api";
import WysiwygEditor from "@/components/ui/WysiwygEditor";

interface NewExperienceProps {
  onBack: () => void;
  onSuccess?: () => void;
  isEditMode?: boolean;
  experienceId?: string;
  initialData?: any;
}

const NewExperience = ({ onBack, onSuccess, isEditMode = false, experienceId, initialData }: NewExperienceProps) => {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSubcategoryDropdownOpen, setIsSubcategoryDropdownOpen] =
    useState(false);
  const [showNewCityForm, setShowNewCityForm] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [newCityCountry, setNewCityCountry] = useState("");
  const [showNewSubcategoryForm, setShowNewSubcategoryForm] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [subcategoryValidationErrors, setSubcategoryValidationErrors] =
    useState<{ [key: string]: string }>({});
  const [experienceValidationErrors, setExperienceValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isCreatingCity, setIsCreatingCity] = useState(false);
  const [isCreatingSubcategory, setIsCreatingSubcategory] = useState(false);

  // Itinerary fields
  const [itinerary, setItinerary] = useState({
    title: "",
    totalDuration: "",
    modeOfTransport: "",
    startPoint: {
      name: "",
      description: "",
      image: "",
      duration: "",
      location: {
        address: "",
        lat: 0,
        lng: 0,
      },
      highlights: [{ name: "", image: "", description: "" }],
      thingsToDo: [{ name: "", image: "", description: "" }],
      nearbyThingsToDo: [{ name: "", image: "", description: "" }],
    },
    points: [
      {
        order: 1,
        name: "",
        description: "",
        image: "",
        duration: "",
        distance: "",
        travelTime: "",
        location: {
          address: "",
          lat: 0,
          lng: 0,
        },
        highlights: [{ name: "", image: "", description: "" }],
        thingsToDo: [{ name: "", image: "", description: "" }],
        attractions: 0,
        ticketsIncluded: false,
        nearbyThingsToDo: [{ name: "", image: "", description: "" }],
      },
    ],
    endPoint: {
      name: "",
      description: "",
      image: "",
      location: {
        address: "",
        lat: 0,
        lng: 0,
      },
    },
  });
  const [hasItinerary, setHasItinerary] = useState(false);

  // Itinerary image states
  const [startPointImage, setStartPointImage] = useState<File | null>(null);
  const [startPointImagePreview, setStartPointImagePreview] = useState<
    string | null
  >(null);
  const [startPointImageError, setStartPointImageError] = useState<
    string | null
  >(null);

  const [endPointImage, setEndPointImage] = useState<File | null>(null);
  const [endPointImagePreview, setEndPointImagePreview] = useState<
    string | null
  >(null);
  const [endPointImageError, setEndPointImageError] = useState<string | null>(
    null
  );

  const [pointImages, setPointImages] = useState<(File | null)[]>([null]);
  const [pointImagePreviews, setPointImagePreviews] = useState<
    (string | null)[]
  >([null]);
  const [pointImageErrors, setPointImageErrors] = useState<(string | null)[]>([
    null,
  ]);

  // Nearby things to do images - nested arrays [pointIndex][nearbyIndex]
  const [nearbyImages, setNearbyImages] = useState<(File | null)[][]>([[null]]);
  const [nearbyImagePreviews, setNearbyImagePreviews] = useState<
    (string | null)[][]
  >([[null]]);
  const [nearbyImageErrors, setNearbyImageErrors] = useState<
    (string | null)[][]
  >([[null]]);

  // Highlights images - nested arrays [pointIndex][highlightIndex]
  const [highlightsImages, setHighlightsImages] = useState<(File | null)[][]>([
    [null],
  ]);
  const [highlightsImagePreviews, setHighlightsImagePreviews] = useState<
    (string | null)[][]
  >([[null]]);
  const [highlightsImageErrors, setHighlightsImageErrors] = useState<
    (string | null)[][]
  >([[null]]);

  // Things to do images - nested arrays [pointIndex][thingIndex]
  const [thingsImages, setThingsImages] = useState<(File | null)[][]>([[null]]);
  const [thingsImagePreviews, setThingsImagePreviews] = useState<
    (string | null)[][]
  >([[null]]);
  const [thingsImageErrors, setThingsImageErrors] = useState<
    (string | null)[][]
  >([[null]]);

  // Experience form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [isOnSale, setIsOnSale] = useState(false);
  const [oldPrice, setOldPrice] = useState<number>(0);
  const [adultPrice, setAdultPrice] = useState<number>(0);
  const [childPrice, setChildPrice] = useState<number>(0);
  const [infantPrice, setinfantPrice] = useState<number>(0);
  const [totalLimit, setTotalLimit] = useState<number>(0);
  const [images, setImages] = useState<File[]>([]);
  const [mainImages, setMainImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImagePreviews, setMainImagePreviews] = useState<string[]>([]);
  const [tagsOnCard, setTagsOnCard] = useState("");
  const [isMainCard, setIsMainCard] = useState(false);
  const [isTopExperience, setIsTopExperience] = useState(false);
  const [isMustDo, setIsMustDo] = useState(false);
  const [isPopular, setIsPopular] = useState(false);

  // WYSIWYG content fields
  const [highlights, setHighlights] = useState("");
  const [inclusions, setInclusions] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [youExperience, setYouExperience] = useState("");
  const [knowBeforeYouGo, setKnowBeforeYouGo] = useState("");
  const [myTickets, setMyTickets] = useState("");
  const [exploreMore, setExploreMore] = useState("");

  // Blog slugs state
  const [blogSlugs, setBlogSlugs] = useState<string[]>([]);
  const [newSlug, setNewSlug] = useState("");

  // Blog slug helper functions
  const addBlogSlug = () => {
    if (newSlug.trim() && !blogSlugs.includes(newSlug.trim())) {
      setBlogSlugs([...blogSlugs, newSlug.trim()]);
      setNewSlug("");
    }
  };

  const removeBlogSlug = (index: number) => {
    setBlogSlugs(blogSlugs.filter((_, i) => i !== index));
  };

  const handleSlugKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBlogSlug();
    }
  };

  // Structured feature fields
  const [duration, setDuration] = useState("");
  const [openToday, setOpenToday] = useState("");
  const [freeCancellation, setFreeCancellation] = useState("");
  const [bookNowPayLater, setBookNowPayLater] = useState("");
  const [guidedTour, setGuidedTour] = useState("");

  // Operating hours
  type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

  const [operatingHours, setOperatingHours] = useState<Array<{
    startDate: string;
    endDate: string;
    openTime: string;
    closeTime: string;
    lastEntryTime: string;
    title: string;
    excludedDays: DayOfWeek[];
  }>>([
    {
      startDate: "",
      endDate: "",
      openTime: "",
      closeTime: "",
      lastEntryTime: "",
      title: "Regular Hours",
      excludedDays: [],
    },
  ]);

  // Date price range
  const [datePriceRange, setDatePriceRange] = useState([
    {
      startDate: "",
      endDate: "",
      price: 0,
    },
  ]);

  // Location (whereTo)
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  // Package type
  const [packageType, setPackageType] = useState({
    name: "",
    price: 0,
    points: [
      {
        title: "",
        subpoints: [""],
      },
    ],
    timePriceSlots: [
      {
        openTime: "",
        closeTime: "",
        price: 0,
      },
    ],
  });

  // Fetch cities and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch cities
        const citiesResponse: any = await fetchCities();
        let citiesList: City[] = [];
        if (Array.isArray(citiesResponse)) {
          citiesList = citiesResponse;
        } else if (citiesResponse.data && Array.isArray(citiesResponse.data)) {
          citiesList = citiesResponse.data;
        } else if (
          citiesResponse.success &&
          citiesResponse.data &&
          Array.isArray(citiesResponse.data)
        ) {
          citiesList = citiesResponse.data;
        }
        setCities(citiesList);

        // Fetch categories
        const categoriesResponse: any = await fetchCategories();
        let categoriesList: Category[] = [];
        if (Array.isArray(categoriesResponse)) {
          categoriesList = categoriesResponse;
        } else if (
          categoriesResponse.data &&
          Array.isArray(categoriesResponse.data)
        ) {
          categoriesList = categoriesResponse.data;
        } else if (
          categoriesResponse.success &&
          categoriesResponse.data &&
          Array.isArray(categoriesResponse.data)
        ) {
          categoriesList = categoriesResponse.data;
        }
        setCategories(categoriesList);

        // Fetch subcategories
        const subcategoriesResponse: any = await fetchSubcategories();
        let subcategoriesList: Subcategory[] = [];
        if (Array.isArray(subcategoriesResponse)) {
          subcategoriesList = subcategoriesResponse;
        } else if (
          subcategoriesResponse.data &&
          Array.isArray(subcategoriesResponse.data)
        ) {
          subcategoriesList = subcategoriesResponse.data;
        } else if (
          subcategoriesResponse.success &&
          subcategoriesResponse.data &&
          Array.isArray(subcategoriesResponse.data)
        ) {
          subcategoriesList = subcategoriesResponse.data;
        }
        setSubcategories(subcategoriesList);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Initialize form data when in edit mode
  useEffect(() => {
    if (isEditMode && initialData && cities.length > 0 && categories.length > 0 && subcategories.length > 0) {

      // Set city, category, subcategory
      if (initialData.cityName) {
        const foundCity = cities.find((city: any) =>
          city.cityName === initialData.cityName || city.name === initialData.cityName
        );
        if (foundCity) {
          setSelectedCity(foundCity);
        }
      }

      if (initialData.categoryName) {
        const foundCategory = categories.find((category: any) =>
          category.categoryName === initialData.categoryName || category.name === initialData.categoryName
        );
        if (foundCategory) {
          setSelectedCategory(foundCategory);
        }
      }

      if (initialData.subcategoryName) {
        const foundSubcategory = subcategories.find((subcategory: any) =>
          subcategory.subcategoryName === initialData.subcategoryName || subcategory.name === initialData.subcategoryName
        );
        if (foundSubcategory) {
          setSelectedSubcategory(foundSubcategory);
        }
      }

      // Basic fields
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPrice(initialData.price || 0);
      setIsOnSale(initialData.isOnSale || false);
      setOldPrice(initialData.oldPrice || 0);
      setAdultPrice(initialData.adultPrice || 0);
      setChildPrice(initialData.childPrice || 0);
      setinfantPrice(initialData.infantPrice || 0);
      setTotalLimit(initialData.totalLimit || 0);
      setTagsOnCard(initialData.tagOnCards || '');
      setIsMainCard(initialData.isMainCard || false);
      setIsTopExperience(initialData.isTopExperience || false);
      setIsMustDo(initialData.isMustDo || false);
      setIsPopular(initialData.isPopular || false);

      // Features - handle array structure mapping by index
      if (initialData.features && Array.isArray(initialData.features)) {
        // Map features array by index: [duration, openToday, freeCancellation, bookNowPayLater, guidedTour]
        setDuration(initialData.features[0] || '');
        setOpenToday(initialData.features[1] || '');
        setFreeCancellation(initialData.features[2] || '');
        setBookNowPayLater(initialData.features[3] || '');
        setGuidedTour(initialData.features[4] || '');
      }

      // WYSIWYG content - stored directly on the experience object
      setHighlights(initialData.highlights || '');
      setInclusions(initialData.inclusions || '');
      setExclusions(initialData.exclusions || '');
      setCancellationPolicy(initialData.cancellationPolicy || '');
      setYouExperience(initialData.youExperience || '');
      setKnowBeforeYouGo(initialData.knowBeforeYouGo || '');
      setMyTickets(initialData.myTickets || '');
      setExploreMore(initialData.exploreMore || '');

      // Images - set preview URLs from existing images
      if (initialData.mainImage && Array.isArray(initialData.mainImage)) {
        setMainImagePreviews(initialData.mainImage);
      }

      if (initialData.images && Array.isArray(initialData.images)) {
        setImagePreviews(initialData.images);
      }

      // Blog slugs
      if (initialData.blogSlug && Array.isArray(initialData.blogSlug)) {
        setBlogSlugs(initialData.blogSlug);
      }

      // Operating hours
      if (initialData.operatingHours && Array.isArray(initialData.operatingHours)) {
        const formattedOperatingHours = initialData.operatingHours.map((hours: any) => ({
          startDate: hours.startDate ? new Date(hours.startDate).toISOString().split('T')[0] : '',
          endDate: hours.endDate ? new Date(hours.endDate).toISOString().split('T')[0] : '',
          openTime: hours.openTime || '',
          closeTime: hours.closeTime || '',
          lastEntryTime: hours.lastEntryTime || '',
          title: hours.title || 'Regular Hours',
          excludedDays: hours.excludedDays || [],
        }));
        setOperatingHours(formattedOperatingHours);
      }

      // Date price range
      if (initialData.datePriceRange && Array.isArray(initialData.datePriceRange)) {
        const formattedDatePriceRange = initialData.datePriceRange.map((range: any) => ({
          startDate: range.startDate ? new Date(range.startDate).toISOString().split('T')[0] : '',
          endDate: range.endDate ? new Date(range.endDate).toISOString().split('T')[0] : '',
          price: range.price || 0,
        }));
        setDatePriceRange(formattedDatePriceRange);
      }

      // Location
      if (initialData.whereTo) {
        setAddress(initialData.whereTo.address || '');
        setLatitude(initialData.whereTo.lat || 0);
        setLongitude(initialData.whereTo.lng || 0);
      }

      // Package type
      if (initialData.packageType) {
        setPackageType({
          name: initialData.packageType.name || '',
          price: initialData.packageType.price || 0,
          points: initialData.packageType.points || [{
            title: '',
            subpoints: [''],
          }],
          timePriceSlots: initialData.packageType.timePriceSlots || [{
            openTime: '',
            closeTime: '',
            price: 0,
          }],
        });
      }

      // Itinerary
      if (initialData.itinerary) {
        setHasItinerary(true);
        setItinerary({
          title: initialData.itinerary.title || '',
          totalDuration: initialData.itinerary.totalDuration || '',
          modeOfTransport: initialData.itinerary.modeOfTransport || '',
          startPoint: {
            name: initialData.itinerary.startPoint?.name || '',
            description: initialData.itinerary.startPoint?.description || '',
            image: initialData.itinerary.startPoint?.image || '',
            duration: initialData.itinerary.startPoint?.duration || '',
            location: {
              address: initialData.itinerary.startPoint?.location?.address || '',
              lat: initialData.itinerary.startPoint?.location?.lat || 0,
              lng: initialData.itinerary.startPoint?.location?.lng || 0,
            },
            highlights: initialData.itinerary.startPoint?.highlights?.map((h: any) => ({
              name: typeof h === 'string' ? h : h.name || '',
              image: '',
              description: '',
            })) || [{ name: '', image: '', description: '' }],
            thingsToDo: initialData.itinerary.startPoint?.thingsToDo?.map((t: any) => ({
              name: typeof t === 'string' ? t : t.name || '',
              image: '',
              description: '',
            })) || [{ name: '', image: '', description: '' }],
            nearbyThingsToDo: initialData.itinerary.startPoint?.nearbyThingsToDo || [{ name: '', image: '', description: '' }],
          },
          points: initialData.itinerary.points?.map((point: any) => ({
            order: point.order || 1,
            name: point.name || '',
            description: point.description || '',
            image: point.image || '',
            duration: point.duration || '',
            distance: point.distance || '',
            travelTime: point.travelTime || '',
            location: {
              address: point.location?.address || '',
              lat: point.location?.lat || 0,
              lng: point.location?.lng || 0,
            },
            highlights: point.highlights || [{ name: '', image: '', description: '' }],
            thingsToDo: point.thingsToDo || [{ name: '', image: '', description: '' }],
            attractions: point.attractions || 0,
            ticketsIncluded: point.ticketsIncluded || false,
            nearbyThingsToDo: point.nearbyThingsToDo || [{ name: '', image: '', description: '' }],
          })) || [{
            order: 1,
            name: '',
            description: '',
            image: '',
            duration: '',
            distance: '',
            travelTime: '',
            location: { address: '', lat: 0, lng: 0 },
            highlights: [{ name: '', image: '', description: '' }],
            thingsToDo: [{ name: '', image: '', description: '' }],
            attractions: 0,
            ticketsIncluded: false,
            nearbyThingsToDo: [{ name: '', image: '', description: '' }],
          }],
          endPoint: {
            name: initialData.itinerary.endPoint?.name || '',
            description: initialData.itinerary.endPoint?.description || '',
            image: initialData.itinerary.endPoint?.image || '',
            location: {
              address: initialData.itinerary.endPoint?.location?.address || '',
              lat: initialData.itinerary.endPoint?.location?.lat || 0,
              lng: initialData.itinerary.endPoint?.location?.lng || 0,
            },
          },
        });

        // Set itinerary image previews
        if (initialData.itinerary.startPoint?.image) {
          setStartPointImagePreview(initialData.itinerary.startPoint.image);
        }

        if (initialData.itinerary.endPoint?.image) {
          setEndPointImagePreview(initialData.itinerary.endPoint.image);
        }

        // Set point images previews
        if (initialData.itinerary.points && Array.isArray(initialData.itinerary.points)) {
          const pointImageUrls = initialData.itinerary.points.map((point: any) => point.image || null);
          setPointImagePreviews(pointImageUrls);
        }
      }

    }
  }, [isEditMode, initialData, cities, categories, subcategories]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setIsDropdownOpen(false);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
  };

  const handleSubcategorySelect = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsSubcategoryDropdownOpen(false);
  };

  const handleCreateNewSubcategory = () => {
    setShowNewSubcategoryForm(true);
    setIsSubcategoryDropdownOpen(false);
  };

  const handleCreateNewCity = () => {
    setShowNewCityForm(true);
    setIsDropdownOpen(false);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageError(null);

    const validation = validateImageFile(file);
    if (!validation.success) {
      setImageError(validation.error || "Invalid file");
      return;
    }

    setSelectedImage(file);
    const preview = createImagePreview(file);
    setImagePreview(preview);
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      revokeImagePreview(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
    setImageError(null);
  };

  const handleSaveNewCity = async () => {
    // Clear previous validation errors
    setValidationErrors({});

    // Validate form data using zod schema
    const formData: CityFormData = {
      cityName: newCityName,
      countryName: newCityCountry,
      image: selectedImage!,
    };

    const validation = cityFormSchema.safeParse(formData);

    if (!validation.success) {
      // Extract validation errors
      const errors: { [key: string]: string } = {};
      validation.error.errors.forEach((error) => {
        const field = error.path.join(".");
        errors[field] = error.message;
      });
      setValidationErrors(errors);
      return;
    }

    setIsCreatingCity(true);

    try {
      // Call API to create new city with validated data
      const newCity = await createCity({
        cityName: validation.data.cityName,
        countryName: validation.data.countryName,
        image: validation.data.image,
      });

      // Add to local state and select it
      setCities((prev) => [...prev, newCity]);
      setSelectedCity(newCity);

      // Close modal and reset form
      setShowNewCityForm(false);
      handleCancelNewCity();
    } catch (error) {
      console.error("Error creating city:", error);
      alert("Failed to create city. Please try again.");
    } finally {
      setIsCreatingCity(false);
    }
  };

  const handleCancelNewCity = () => {
    setShowNewCityForm(false);
    setNewCityName("");
    setNewCityCountry("");
    setValidationErrors({});
    handleRemoveImage();
  };

  const handleSaveNewSubcategory = async () => {
    // Clear previous validation errors
    setSubcategoryValidationErrors({});

    // Validate form data using zod schema
    const formData: SubcategoryFormData = {
      subcategoryName: newSubcategoryName,
    };

    const validation = subcategoryFormSchema.safeParse(formData);

    if (!validation.success) {
      // Extract validation errors
      const errors: { [key: string]: string } = {};
      validation.error.errors.forEach((error) => {
        const field = error.path.join(".");
        errors[field] = error.message;
      });
      setSubcategoryValidationErrors(errors);
      return;
    }

    setIsCreatingSubcategory(true);

    try {
      // Call API to create new subcategory with validated data
      const newSubcategory = await createSubcategory({
        subcategoryName: validation.data.subcategoryName,
      });

      // Add to local state and select it
      setSubcategories((prev) => [...prev, newSubcategory]);
      setSelectedSubcategory(newSubcategory);

      // Close modal and reset form
      setShowNewSubcategoryForm(false);
      handleCancelNewSubcategory();
    } catch (error) {
      console.error("Error creating subcategory:", error);
      alert("Failed to create subcategory. Please try again.");
    } finally {
      setIsCreatingSubcategory(false);
    }
  };

  const handleCancelNewSubcategory = () => {
    setShowNewSubcategoryForm(false);
    setNewSubcategoryName("");
    setSubcategoryValidationErrors({});
  };

  // Handle sale toggle - move current price to old price when enabling sale
  const handleSaleToggle = () => {
    if (!isOnSale && price > 0) {
      setOldPrice(price);
      setPrice(0);
    }
    setIsOnSale(!isOnSale);
  };

  // Handle images upload
  const handleImagesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach((file) => {
      const validation = validateImageFile(file);
      if (validation.success) {
        validFiles.push(file);
        newPreviews.push(createImagePreview(file));
      }
    });

    setImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Handle main images upload
  const handleMainImagesSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach((file) => {
      const validation = validateImageFile(file);
      if (validation.success) {
        validFiles.push(file);
        newPreviews.push(createImagePreview(file));
      }
    });

    setMainImages((prev) => [...prev, ...validFiles]);
    setMainImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove image from array
  const removeImage = (index: number, isMain: boolean = false) => {
    if (isMain) {
      // Revoke preview URL
      revokeImagePreview(mainImagePreviews[index]);
      // Remove from arrays
      setMainImages((prev) => prev.filter((_, i) => i !== index));
      setMainImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Revoke preview URL
      revokeImagePreview(imagePreviews[index]);
      // Remove from arrays
      setImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Operating hours management
  const addOperatingHour = () => {
    setOperatingHours((prev) => [
      ...prev,
      {
        startDate: "",
        endDate: "",
        openTime: "",
        closeTime: "",
        lastEntryTime: "",
        title: "Regular Hours",
        excludedDays: [],
      },
    ]);
  };

  const removeOperatingHour = (index: number) => {
    if (operatingHours.length > 1) {
      setOperatingHours((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateOperatingHour = (index: number, field: string, value: string | DayOfWeek[]) => {
    setOperatingHours((prev) =>
      prev.map((hour, i) => (i === index ? { ...hour, [field]: value } : hour))
    );
  };

  // Date price range management
  const addDatePriceRange = () => {
    setDatePriceRange((prev) => [
      ...prev,
      {
        startDate: "",
        endDate: "",
        price: 0,
      },
    ]);
  };

  const removeDatePriceRange = (index: number) => {
    if (datePriceRange.length > 1) {
      setDatePriceRange((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateDatePriceRange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setDatePriceRange((prev) =>
      prev.map((range, i) =>
        i === index ? { ...range, [field]: value } : range
      )
    );
  };

  // Package type management
  const updatePackageType = (field: string, value: string | number) => {
    setPackageType((prev) => ({ ...prev, [field]: value }));
  };

  const addPoint = () => {
    setPackageType((prev) => ({
      ...prev,
      points: [...prev.points, { title: "", subpoints: [""] }],
    }));
  };

  const removePoint = (index: number) => {
    if (packageType.points.length > 1) {
      setPackageType((prev) => ({
        ...prev,
        points: prev.points.filter((_, i) => i !== index),
      }));
    }
  };

  const updatePoint = (index: number, field: string, value: string) => {
    setPackageType((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === index ? { ...point, [field]: value } : point
      ),
    }));
  };

  const addSubpoint = (pointIndex: number) => {
    if (pointIndex !== 1) return; // Only allow subpoints for the second point (index 1)
    setPackageType((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === pointIndex
          ? {
              ...point,
              subpoints: [...(point.subpoints || []), ""].slice(0, 5), // Max 5 subpoints
            }
          : point
      ),
    }));
  };

  const removeSubpoint = (pointIndex: number, subpointIndex: number) => {
    if (pointIndex !== 1) return; // Only allow subpoint removal for the second point
    setPackageType((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === pointIndex
          ? {
              ...point,
              subpoints:
                point.subpoints?.filter((_, j) => j !== subpointIndex) || [],
            }
          : point
      ),
    }));
  };

  const updateSubpoint = (
    pointIndex: number,
    subpointIndex: number,
    value: string
  ) => {
    if (pointIndex !== 1) return; // Only allow subpoint updates for the second point
    setPackageType((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === pointIndex
          ? {
              ...point,
              subpoints:
                point.subpoints?.map((subpoint, j) =>
                  j === subpointIndex ? value : subpoint
                ) || [],
            }
          : point
      ),
    }));
  };

  const addTimePriceSlot = () => {
    setPackageType((prev) => ({
      ...prev,
      timePriceSlots: [
        ...prev.timePriceSlots,
        { openTime: "", closeTime: "", price: 0 },
      ],
    }));
  };

  const removeTimePriceSlot = (index: number) => {
    if (packageType.timePriceSlots.length > 1) {
      setPackageType((prev) => ({
        ...prev,
        timePriceSlots: prev.timePriceSlots.filter((_, i) => i !== index),
      }));
    }
  };

  const updateTimePriceSlot = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setPackageType((prev) => ({
      ...prev,
      timePriceSlots: prev.timePriceSlots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  // Itinerary management functions
  const updateItinerary = (field: string, value: any) => {
    setItinerary((prev) => ({ ...prev, [field]: value }));
  };

  const updateStartPoint = (field: string, value: any) => {
    setItinerary((prev) => ({
      ...prev,
      startPoint: { ...prev.startPoint, [field]: value },
    }));
  };

  const updateStartPointLocation = (field: string, value: any) => {
    setItinerary((prev) => ({
      ...prev,
      startPoint: {
        ...prev.startPoint,
        location: { ...prev.startPoint.location, [field]: value },
      },
    }));
  };

  const updateEndPoint = (field: string, value: any) => {
    setItinerary((prev) => ({
      ...prev,
      endPoint: { ...prev.endPoint, [field]: value },
    }));
  };

  const updateEndPointLocation = (field: string, value: any) => {
    setItinerary((prev) => ({
      ...prev,
      endPoint: {
        ...prev.endPoint,
        location: { ...prev.endPoint.location, [field]: value },
      },
    }));
  };

  const addItineraryPoint = () => {
    setItinerary((prev) => ({
      ...prev,
      points: [
        ...prev.points,
        {
          order: prev.points.length + 1,
          name: "",
          description: "",
          image: "",
          duration: "",
          distance: "",
          travelTime: "",
          location: {
            address: "",
            lat: 0,
            lng: 0,
          },
          highlights: [{ name: "", image: "", description: "" }],
          thingsToDo: [{ name: "", image: "", description: "" }],
          attractions: 0,
          ticketsIncluded: false,
          nearbyThingsToDo: [{ name: "", image: "", description: "" }],
        },
      ],
    }));

    // Add image states for new point
    setPointImages((prev) => [...prev, null]);
    setPointImagePreviews((prev) => [...prev, null]);
    setPointImageErrors((prev) => [...prev, null]);

    // Add nearby image states for new point
    setNearbyImages((prev) => [...prev, [null]]);
    setNearbyImagePreviews((prev) => [...prev, [null]]);
    setNearbyImageErrors((prev) => [...prev, [null]]);

    // Add highlights image states for new point
    setHighlightsImages((prev) => [...prev, [null]]);
    setHighlightsImagePreviews((prev) => [...prev, [null]]);
    setHighlightsImageErrors((prev) => [...prev, [null]]);

    // Add things image states for new point
    setThingsImages((prev) => [...prev, [null]]);
    setThingsImagePreviews((prev) => [...prev, [null]]);
    setThingsImageErrors((prev) => [...prev, [null]]);
  };

  const removeItineraryPoint = (index: number) => {
    if (itinerary.points.length > 1) {
      // Revoke image preview if exists
      const preview = pointImagePreviews[index];
      if (preview) {
        revokeImagePreview(preview);
      }

      setItinerary((prev) => ({
        ...prev,
        points: prev.points
          .filter((_, i) => i !== index)
          .map((point, i) => ({ ...point, order: i + 1 })),
      }));

      // Remove corresponding image states
      setPointImages((prev) => prev.filter((_, i) => i !== index));
      setPointImagePreviews((prev) => prev.filter((_, i) => i !== index));
      setPointImageErrors((prev) => prev.filter((_, i) => i !== index));

      // Remove corresponding nearby image states
      // First revoke all nearby previews for this point
      const nearbyPreviews = nearbyImagePreviews[index];
      if (nearbyPreviews) {
        nearbyPreviews.forEach((preview) => {
          if (preview) revokeImagePreview(preview);
        });
      }

      setNearbyImages((prev) => prev.filter((_, i) => i !== index));
      setNearbyImagePreviews((prev) => prev.filter((_, i) => i !== index));
      setNearbyImageErrors((prev) => prev.filter((_, i) => i !== index));

      // Remove corresponding highlights image states
      const highlightsPreviews = highlightsImagePreviews[index];
      if (highlightsPreviews) {
        highlightsPreviews.forEach((preview) => {
          if (preview) revokeImagePreview(preview);
        });
      }

      setHighlightsImages((prev) => prev.filter((_, i) => i !== index));
      setHighlightsImagePreviews((prev) => prev.filter((_, i) => i !== index));
      setHighlightsImageErrors((prev) => prev.filter((_, i) => i !== index));

      // Remove corresponding things image states
      const thingsPreviews = thingsImagePreviews[index];
      if (thingsPreviews) {
        thingsPreviews.forEach((preview) => {
          if (preview) revokeImagePreview(preview);
        });
      }

      setThingsImages((prev) => prev.filter((_, i) => i !== index));
      setThingsImagePreviews((prev) => prev.filter((_, i) => i !== index));
      setThingsImageErrors((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateItineraryPoint = (index: number, field: string, value: any) => {
    setItinerary((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === index ? { ...point, [field]: value } : point
      ),
    }));
  };

  const updateItineraryPointLocation = (
    index: number,
    field: string,
    value: any
  ) => {
    setItinerary((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === index
          ? {
              ...point,
              location: { ...point.location, [field]: value },
            }
          : point
      ),
    }));
  };


  // Array management functions for itinerary points
  const addPointHighlight = (pointIndex: number) => {
    setItinerary((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === pointIndex
          ? {
              ...point,
              highlights: [
                ...point.highlights,
                { name: "", image: "", description: "" },
              ],
            }
          : point
      ),
    }));

    // Add highlight image state for new highlight
    setHighlightsImages((prev) =>
      prev.map((pointImages, i) =>
        i === pointIndex ? [...pointImages, null] : pointImages
      )
    );
    setHighlightsImagePreviews((prev) =>
      prev.map((pointPreviews, i) =>
        i === pointIndex ? [...pointPreviews, null] : pointPreviews
      )
    );
    setHighlightsImageErrors((prev) =>
      prev.map((pointErrors, i) =>
        i === pointIndex ? [...pointErrors, null] : pointErrors
      )
    );
  };

  const removePointHighlight = (pointIndex: number, highlightIndex: number) => {
    // Revoke image preview if exists
    const preview = highlightsImagePreviews[pointIndex]?.[highlightIndex];
    if (preview) {
      revokeImagePreview(preview);
    }

    setItinerary((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === pointIndex
          ? {
              ...point,
              highlights: point.highlights.filter(
                (_, j) => j !== highlightIndex
              ),
            }
          : point
      ),
    }));

    // Remove corresponding highlight image states
    setHighlightsImages((prev) =>
      prev.map((pointImages, i) =>
        i === pointIndex
          ? pointImages.filter((_, j) => j !== highlightIndex)
          : pointImages
      )
    );
    setHighlightsImagePreviews((prev) =>
      prev.map((pointPreviews, i) =>
        i === pointIndex
          ? pointPreviews.filter((_, j) => j !== highlightIndex)
          : pointPreviews
      )
    );
    setHighlightsImageErrors((prev) =>
      prev.map((pointErrors, i) =>
        i === pointIndex
          ? pointErrors.filter((_, j) => j !== highlightIndex)
          : pointErrors
      )
    );
  };

  const updatePointHighlight = (
    pointIndex: number,
    highlightIndex: number,
    field: string,
    value: string
  ) => {
    setItinerary((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === pointIndex
          ? {
              ...point,
              highlights: point.highlights.map((highlight, j) =>
                j === highlightIndex
                  ? { ...highlight, [field]: value }
                  : highlight
              ),
            }
          : point
      ),
    }));
  };

  const addPointThingToDo = (pointIndex: number) => {
    setItinerary((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === pointIndex
          ? {
              ...point,
              thingsToDo: [
                ...point.thingsToDo,
                { name: "", image: "", description: "" },
              ],
            }
          : point
      ),
    }));

    // Add things image state for new thing
    setThingsImages((prev) =>
      prev.map((pointImages, i) =>
        i === pointIndex ? [...pointImages, null] : pointImages
      )
    );
    setThingsImagePreviews((prev) =>
      prev.map((pointPreviews, i) =>
        i === pointIndex ? [...pointPreviews, null] : pointPreviews
      )
    );
    setThingsImageErrors((prev) =>
      prev.map((pointErrors, i) =>
        i === pointIndex ? [...pointErrors, null] : pointErrors
      )
    );
  };

  const removePointThingToDo = (pointIndex: number, thingIndex: number) => {
    // Revoke image preview if exists
    const preview = thingsImagePreviews[pointIndex]?.[thingIndex];
    if (preview) {
      revokeImagePreview(preview);
    }

    setItinerary((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === pointIndex
          ? {
              ...point,
              thingsToDo: point.thingsToDo.filter((_, j) => j !== thingIndex),
            }
          : point
      ),
    }));

    // Remove corresponding things image states
    setThingsImages((prev) =>
      prev.map((pointImages, i) =>
        i === pointIndex
          ? pointImages.filter((_, j) => j !== thingIndex)
          : pointImages
      )
    );
    setThingsImagePreviews((prev) =>
      prev.map((pointPreviews, i) =>
        i === pointIndex
          ? pointPreviews.filter((_, j) => j !== thingIndex)
          : pointPreviews
      )
    );
    setThingsImageErrors((prev) =>
      prev.map((pointErrors, i) =>
        i === pointIndex
          ? pointErrors.filter((_, j) => j !== thingIndex)
          : pointErrors
      )
    );
  };

  const updatePointThingToDo = (
    pointIndex: number,
    thingIndex: number,
    field: string,
    value: string
  ) => {
    setItinerary((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === pointIndex
          ? {
              ...point,
              thingsToDo: point.thingsToDo.map((thing, j) =>
                j === thingIndex ? { ...thing, [field]: value } : thing
              ),
            }
          : point
      ),
    }));
  };

  const addPointNearbyThingToDo = (pointIndex: number) => {
    setItinerary((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === pointIndex
          ? {
              ...point,
              nearbyThingsToDo: [
                ...point.nearbyThingsToDo,
                { name: "", image: "", description: "" },
              ],
            }
          : point
      ),
    }));

    // Add nearby image state for new nearby item
    setNearbyImages((prev) =>
      prev.map((pointImages, i) =>
        i === pointIndex ? [...pointImages, null] : pointImages
      )
    );
    setNearbyImagePreviews((prev) =>
      prev.map((pointPreviews, i) =>
        i === pointIndex ? [...pointPreviews, null] : pointPreviews
      )
    );
    setNearbyImageErrors((prev) =>
      prev.map((pointErrors, i) =>
        i === pointIndex ? [...pointErrors, null] : pointErrors
      )
    );
  };

  const removePointNearbyThingToDo = (
    pointIndex: number,
    nearbyIndex: number
  ) => {
    // Revoke image preview if exists
    const preview = nearbyImagePreviews[pointIndex]?.[nearbyIndex];
    if (preview) {
      revokeImagePreview(preview);
    }

    setItinerary((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === pointIndex
          ? {
              ...point,
              nearbyThingsToDo: point.nearbyThingsToDo.filter(
                (_, j) => j !== nearbyIndex
              ),
            }
          : point
      ),
    }));

    // Remove corresponding nearby image states
    setNearbyImages((prev) =>
      prev.map((pointImages, i) =>
        i === pointIndex
          ? pointImages.filter((_, j) => j !== nearbyIndex)
          : pointImages
      )
    );
    setNearbyImagePreviews((prev) =>
      prev.map((pointPreviews, i) =>
        i === pointIndex
          ? pointPreviews.filter((_, j) => j !== nearbyIndex)
          : pointPreviews
      )
    );
    setNearbyImageErrors((prev) =>
      prev.map((pointErrors, i) =>
        i === pointIndex
          ? pointErrors.filter((_, j) => j !== nearbyIndex)
          : pointErrors
      )
    );
  };

  const updatePointNearbyThingToDo = (
    pointIndex: number,
    nearbyIndex: number,
    field: string,
    value: string
  ) => {
    setItinerary((prev) => ({
      ...prev,
      points: prev.points.map((point, i) =>
        i === pointIndex
          ? {
              ...point,
              nearbyThingsToDo: point.nearbyThingsToDo.map((nearby, j) =>
                j === nearbyIndex ? { ...nearby, [field]: value } : nearby
              ),
            }
          : point
      ),
    }));
  };

  // Image upload handlers for itinerary
  const handleStartPointImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStartPointImageError(null);

    const validation = validateImageFile(file);
    if (!validation.success) {
      setStartPointImageError(validation.error || "Invalid file");
      return;
    }

    setStartPointImage(file);
    const preview = createImagePreview(file);
    setStartPointImagePreview(preview);
  };

  const removeStartPointImage = () => {
    if (startPointImagePreview) {
      revokeImagePreview(startPointImagePreview);
    }
    setStartPointImage(null);
    setStartPointImagePreview(null);
    setStartPointImageError(null);
  };

  const handleEndPointImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setEndPointImageError(null);

    const validation = validateImageFile(file);
    if (!validation.success) {
      setEndPointImageError(validation.error || "Invalid file");
      return;
    }

    setEndPointImage(file);
    const preview = createImagePreview(file);
    setEndPointImagePreview(preview);
  };

  const removeEndPointImage = () => {
    if (endPointImagePreview) {
      revokeImagePreview(endPointImagePreview);
    }
    setEndPointImage(null);
    setEndPointImagePreview(null);
    setEndPointImageError(null);
  };

  const handlePointImageSelect = (
    pointIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.success) {
      setPointImageErrors((prev) =>
        prev.map((error, i) =>
          i === pointIndex ? validation.error || "Invalid file" : error
        )
      );
      return;
    }

    // Clear error
    setPointImageErrors((prev) =>
      prev.map((error, i) => (i === pointIndex ? null : error))
    );

    // Set image
    setPointImages((prev) =>
      prev.map((img, i) => (i === pointIndex ? file : img))
    );

    // Set preview
    const preview = createImagePreview(file);
    setPointImagePreviews((prev) =>
      prev.map((prevUrl, i) => {
        if (i === pointIndex) {
          // Revoke old preview if exists
          if (prevUrl) revokeImagePreview(prevUrl);
          return preview;
        }
        return prevUrl;
      })
    );
  };

  const removePointImage = (pointIndex: number) => {
    // Revoke preview
    const currentPreview = pointImagePreviews[pointIndex];
    if (currentPreview) {
      revokeImagePreview(currentPreview);
    }

    // Clear image, preview, and error
    setPointImages((prev) =>
      prev.map((img, i) => (i === pointIndex ? null : img))
    );
    setPointImagePreviews((prev) =>
      prev.map((preview, i) => (i === pointIndex ? null : preview))
    );
    setPointImageErrors((prev) =>
      prev.map((error, i) => (i === pointIndex ? null : error))
    );
  };

  // Nearby image handlers
  const handleNearbyImageSelect = (
    pointIndex: number,
    nearbyIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.success) {
      setNearbyImageErrors((prev) =>
        prev.map((pointErrors, pIndex) =>
          pIndex === pointIndex
            ? pointErrors.map((error, nIndex) =>
                nIndex === nearbyIndex
                  ? validation.error || "Invalid file"
                  : error
              )
            : pointErrors
        )
      );
      return;
    }

    // Clear error
    setNearbyImageErrors((prev) =>
      prev.map((pointErrors, pIndex) =>
        pIndex === pointIndex
          ? pointErrors.map((error, nIndex) =>
              nIndex === nearbyIndex ? null : error
            )
          : pointErrors
      )
    );

    // Set image
    setNearbyImages((prev) =>
      prev.map((pointImages, pIndex) =>
        pIndex === pointIndex
          ? pointImages.map((img, nIndex) =>
              nIndex === nearbyIndex ? file : img
            )
          : pointImages
      )
    );

    // Set preview
    const preview = createImagePreview(file);
    setNearbyImagePreviews((prev) =>
      prev.map((pointPreviews, pIndex) => {
        if (pIndex === pointIndex) {
          return pointPreviews.map((prevUrl, nIndex) => {
            if (nIndex === nearbyIndex) {
              // Revoke old preview if exists
              if (prevUrl) revokeImagePreview(prevUrl);
              return preview;
            }
            return prevUrl;
          });
        }
        return pointPreviews;
      })
    );
  };

  const removeNearbyImage = (pointIndex: number, nearbyIndex: number) => {
    // Revoke preview
    const currentPreview = nearbyImagePreviews[pointIndex]?.[nearbyIndex];
    if (currentPreview) {
      revokeImagePreview(currentPreview);
    }

    // Clear image, preview, and error
    setNearbyImages((prev) =>
      prev.map((pointImages, pIndex) =>
        pIndex === pointIndex
          ? pointImages.map((img, nIndex) =>
              nIndex === nearbyIndex ? null : img
            )
          : pointImages
      )
    );
    setNearbyImagePreviews((prev) =>
      prev.map((pointPreviews, pIndex) =>
        pIndex === pointIndex
          ? pointPreviews.map((preview, nIndex) =>
              nIndex === nearbyIndex ? null : preview
            )
          : pointPreviews
      )
    );
    setNearbyImageErrors((prev) =>
      prev.map((pointErrors, pIndex) =>
        pIndex === pointIndex
          ? pointErrors.map((error, nIndex) =>
              nIndex === nearbyIndex ? null : error
            )
          : pointErrors
      )
    );
  };

  // Highlights image handlers
  const handleHighlightImageSelect = (
    pointIndex: number,
    highlightIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.success) {
      setHighlightsImageErrors((prev) =>
        prev.map((pointErrors, pIndex) =>
          pIndex === pointIndex
            ? pointErrors.map((error, hIndex) =>
                hIndex === highlightIndex
                  ? validation.error || "Invalid file"
                  : error
              )
            : pointErrors
        )
      );
      return;
    }

    // Clear error
    setHighlightsImageErrors((prev) =>
      prev.map((pointErrors, pIndex) =>
        pIndex === pointIndex
          ? pointErrors.map((error, hIndex) =>
              hIndex === highlightIndex ? null : error
            )
          : pointErrors
      )
    );

    // Set image
    setHighlightsImages((prev) =>
      prev.map((pointImages, pIndex) =>
        pIndex === pointIndex
          ? pointImages.map((img, hIndex) =>
              hIndex === highlightIndex ? file : img
            )
          : pointImages
      )
    );

    // Set preview
    const preview = createImagePreview(file);
    setHighlightsImagePreviews((prev) =>
      prev.map((pointPreviews, pIndex) => {
        if (pIndex === pointIndex) {
          return pointPreviews.map((prevUrl, hIndex) => {
            if (hIndex === highlightIndex) {
              // Revoke old preview if exists
              if (prevUrl) revokeImagePreview(prevUrl);
              return preview;
            }
            return prevUrl;
          });
        }
        return pointPreviews;
      })
    );
  };

  const removeHighlightImage = (pointIndex: number, highlightIndex: number) => {
    // Revoke preview
    const currentPreview =
      highlightsImagePreviews[pointIndex]?.[highlightIndex];
    if (currentPreview) {
      revokeImagePreview(currentPreview);
    }

    // Clear image, preview, and error
    setHighlightsImages((prev) =>
      prev.map((pointImages, pIndex) =>
        pIndex === pointIndex
          ? pointImages.map((img, hIndex) =>
              hIndex === highlightIndex ? null : img
            )
          : pointImages
      )
    );
    setHighlightsImagePreviews((prev) =>
      prev.map((pointPreviews, pIndex) =>
        pIndex === pointIndex
          ? pointPreviews.map((preview, hIndex) =>
              hIndex === highlightIndex ? null : preview
            )
          : pointPreviews
      )
    );
    setHighlightsImageErrors((prev) =>
      prev.map((pointErrors, pIndex) =>
        pIndex === pointIndex
          ? pointErrors.map((error, hIndex) =>
              hIndex === highlightIndex ? null : error
            )
          : pointErrors
      )
    );
  };

  // Things to do image handlers
  const handleThingImageSelect = (
    pointIndex: number,
    thingIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.success) {
      setThingsImageErrors((prev) =>
        prev.map((pointErrors, pIndex) =>
          pIndex === pointIndex
            ? pointErrors.map((error, tIndex) =>
                tIndex === thingIndex
                  ? validation.error || "Invalid file"
                  : error
              )
            : pointErrors
        )
      );
      return;
    }

    // Clear error
    setThingsImageErrors((prev) =>
      prev.map((pointErrors, pIndex) =>
        pIndex === pointIndex
          ? pointErrors.map((error, tIndex) =>
              tIndex === thingIndex ? null : error
            )
          : pointErrors
      )
    );

    // Set image
    setThingsImages((prev) =>
      prev.map((pointImages, pIndex) =>
        pIndex === pointIndex
          ? pointImages.map((img, tIndex) =>
              tIndex === thingIndex ? file : img
            )
          : pointImages
      )
    );

    // Set preview
    const preview = createImagePreview(file);
    setThingsImagePreviews((prev) =>
      prev.map((pointPreviews, pIndex) => {
        if (pIndex === pointIndex) {
          return pointPreviews.map((prevUrl, tIndex) => {
            if (tIndex === thingIndex) {
              // Revoke old preview if exists
              if (prevUrl) revokeImagePreview(prevUrl);
              return preview;
            }
            return prevUrl;
          });
        }
        return pointPreviews;
      })
    );
  };

  const removeThingImage = (pointIndex: number, thingIndex: number) => {
    // Revoke preview
    const currentPreview = thingsImagePreviews[pointIndex]?.[thingIndex];
    if (currentPreview) {
      revokeImagePreview(currentPreview);
    }

    // Clear image, preview, and error
    setThingsImages((prev) =>
      prev.map((pointImages, pIndex) =>
        pIndex === pointIndex
          ? pointImages.map((img, tIndex) =>
              tIndex === thingIndex ? null : img
            )
          : pointImages
      )
    );
    setThingsImagePreviews((prev) =>
      prev.map((pointPreviews, pIndex) =>
        pIndex === pointIndex
          ? pointPreviews.map((preview, tIndex) =>
              tIndex === thingIndex ? null : preview
            )
          : pointPreviews
      )
    );
    setThingsImageErrors((prev) =>
      prev.map((pointErrors, pIndex) =>
        pIndex === pointIndex
          ? pointErrors.map((error, tIndex) =>
              tIndex === thingIndex ? null : error
            )
          : pointErrors
      )
    );
  };

  // Add submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fill sample data function
  const fillSampleData = () => {
    // Basic experience details
    setTitle("Scenic Harbor Cruise & City Tour Adventure");
    setDescription("Experience the breathtaking beauty of our harbor with a luxurious cruise followed by an exciting city exploration tour. This comprehensive adventure combines the tranquil waters of the harbor with the vibrant culture and history of our downtown district.");
    setPrice(89);
    setIsOnSale(true);
    setOldPrice(120);
    setAdultPrice(89);
    setChildPrice(45);
    setinfantPrice(70);
    setTotalLimit(50);
    setTagsOnCard("Adventure, Scenic, Popular, Water Activity");
    setIsPopular(true);
    setIsMainCard(false);
    setIsTopExperience(false);
    setIsMustDo(false);

    // Structured features
    setDuration("4 hours 30 minutes");
    setOpenToday("Available 9:00 AM - 5:00 PM");
    setFreeCancellation("Free cancellation up to 24 hours before experience");
    setBookNowPayLater("Reserve now and pay later - no upfront payment required");
    setGuidedTour("Professional guided tour with expert local commentary");

    // WYSIWYG content fields with rich HTML content
    setHighlights("<ul><li>Panoramic harbor views from luxury vessel</li><li>Professional photography opportunities</li><li>Complimentary refreshments on board</li><li>Historic city walking tour included</li><li>Small group experience (max 20 people)</li></ul>");
    setInclusions("<ul><li>Harbor cruise ticket</li><li>Professional tour guide</li><li>Light refreshments and beverages</li><li>City walking tour</li><li>Souvenir photo package</li><li>All taxes and fees</li></ul>");
    setExclusions("<ul><li>Hotel pickup and drop-off</li><li>Lunch (available for purchase)</li><li>Personal expenses</li><li>Gratuities (optional)</li><li>Travel insurance</li></ul>");
    setCancellationPolicy("<p><strong>Free Cancellation:</strong> Full refund if cancelled 24+ hours in advance.</p><p><strong>Late Cancellation:</strong> 50% refund if cancelled 6-24 hours before.</p><p><strong>No Show:</strong> No refund for no-shows or cancellations within 6 hours.</p>");
    setYouExperience("<p>Begin your adventure at the historic harbor dock where you'll board our premium vessel. Enjoy stunning coastal views while our captain shares fascinating local maritime history. After the 2-hour cruise, join our expert guide for a walking tour through the city's most iconic neighborhoods, discovering hidden gems and local stories.</p>");
    setKnowBeforeYouGo("<ul><li>Wear comfortable walking shoes</li><li>Bring sun protection and layers</li><li>Activity operates rain or shine</li><li>Moderate physical activity required</li><li>Not wheelchair accessible</li><li>Children must be accompanied by adults</li></ul>");
    setMyTickets("<p>Present your mobile ticket at the harbor dock 15 minutes before departure. Look for the blue and white 'Harbor Adventures' banner. Our crew will be wearing branded uniforms and will assist with boarding.</p>");
    setExploreMore("<p>Extend your adventure with our partner experiences: Harbor Sunset Dinner Cruise, Historic District Food Tour, or Coastal Hiking Expedition. Ask your guide about combination packages and local recommendations.</p>");

    // Blog slugs
    setBlogSlugs(["harbor-cruise-guide", "city-walking-tours", "best-photo-spots", "maritime-history"]);

    // Operating hours - multiple time slots (current year for testing)
    setOperatingHours([
      {
        startDate: "2025-01-01",
        endDate: "2025-03-31",
        openTime: "09:00",
        closeTime: "17:00",
        lastEntryTime: "16:30",
        title: "Winter Schedule",
        excludedDays: [],
      },
      {
        startDate: "2025-04-01",
        endDate: "2025-10-31",
        openTime: "08:00",
        closeTime: "19:00",
        lastEntryTime: "18:30",
        title: "Summer Schedule",
        excludedDays: [],
      },
    ]);

    // Date price ranges - seasonal pricing (current year for testing)
    setDatePriceRange([
      {
        startDate: "2025-01-01",
        endDate: "2025-03-31",
        price: 75,
      },
      {
        startDate: "2025-04-01",
        endDate: "2025-06-30",
        price: 89,
      },
      {
        startDate: "2025-07-01",
        endDate: "2025-08-31",
        price: 110,
      },
    ]);

    // Location details
    setAddress("123 Harbor Drive, Waterfront District, City Center");
    setLatitude(40.7589);
    setLongitude(-73.9851);

    // Package type with detailed structure
    setPackageType({
      name: "Premium Harbor & City Experience",
      price: 89,
      points: [
        {
          title: "Harbor Cruise Experience",
          subpoints: ["2-hour guided harbor tour", "Professional commentary", "Complimentary refreshments"],
        },
        {
          title: "City Walking Tour",
          subpoints: ["Historic district exploration", "Local stories and legends", "Hidden gems discovery", "Photo opportunities", "Cultural insights"],
        },
      ],
      timePriceSlots: [
        {
          openTime: "09:00",
          closeTime: "13:30",
          price: 89,
        },
        {
          openTime: "14:00",
          closeTime: "18:30",
          price: 95,
        },
      ],
    });

    // Enable itinerary and set comprehensive data
    setHasItinerary(true);
    setItinerary({
      title: "Harbor Cruise & City Tour Complete Itinerary",
      totalDuration: "4 hours 30 minutes",
      modeOfTransport: "Walking and Boat",
      startPoint: {
        name: "Harbor Adventure Dock",
        description: "Historic waterfront boarding area with stunning harbor views and convenient amenities.",
        image: "",
        duration: "15 minutes",
        location: {
          address: "123 Harbor Drive, Pier 15",
          lat: 40.7589,
          lng: -73.9851,
        },
        highlights: [],
        thingsToDo: [ ],
        nearbyThingsToDo: [],
      },
      points: [
        {
          order: 1,
          name: "Harbor Cruise Departure",
          description: "Board our luxury vessel and begin your harbor adventure with welcome drinks and safety briefing.",
          image: "",
          duration: "2 hours",
          distance: "8 nautical miles",
          travelTime: "2 hours",
          location: {
            address: "Harbor Waters - Various Points",
            lat: 40.7505,
            lng: -73.9934,
          },
          highlights: [
            { name: "Lighthouse Views", image: "", description: "Historic lighthouse and coastal scenery" },
            { name: "Marine Wildlife", image: "", description: "Dolphins, seals, and coastal birds" }
          ],
          thingsToDo: [
            { name: "Photography", image: "", description: "Capture stunning harbor and city skyline photos" },
            { name: "Captain's Commentary", image: "", description: "Learn maritime history and local legends" }
          ],
          attractions: 3,
          ticketsIncluded: true,
          nearbyThingsToDo: [
            { name: "Deck Refreshments", image: "", description: "Complimentary beverages and light snacks" }
          ],
        },
        {
          order: 2,
          name: "Historic District Walking Tour",
          description: "Disembark and explore the city's most charming historic district with cobblestone streets and preserved architecture.",
          image: "",
          duration: "1.5 hours",
          distance: "1.2 miles",
          travelTime: "1.5 hours",
          location: {
            address: "Old Town Historic District",
            lat: 40.7614,
            lng: -73.9776,
          },
          highlights: [
            { name: "Colonial Architecture", image: "", description: "18th-century buildings and historic facades" },
            { name: "Cultural Landmarks", image: "", description: "Museums, galleries, and heritage sites" }
          ],
          thingsToDo: [
            { name: "Guided Storytelling", image: "", description: "Fascinating local stories and historical facts" },
            { name: "Architecture Appreciation", image: "", description: "Detailed exploration of historic buildings" }
          ],
          attractions: 5,
          ticketsIncluded: false,
          nearbyThingsToDo: [
            { name: "Artisan Shops", image: "", description: "Local craftspeople and unique souvenirs" },
            { name: "Historic Taverns", image: "", description: "Traditional pubs with local character" }
          ],
        },
      ],
      endPoint: {
        name: "City Center Plaza",
        description: "Vibrant central plaza surrounded by shops, restaurants, and cultural attractions - perfect for continuing your exploration.",
        image: "",
        location: {
          address: "Central Plaza, Downtown Core",
          lat: 40.7614,
          lng: -73.9776,
        },
      },
    });

  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setExperienceValidationErrors({});

    try {
      // Validate required fields before creating FormData
      if (!selectedCity) {
        setSubmitError('Please select a city');
        setIsSubmitting(false);
        return;
      }
      if (!selectedCategory) {
        setSubmitError('Please select a category');
        setIsSubmitting(false);
        return;
      }
      if (!selectedSubcategory) {
        setSubmitError('Please select a subcategory');
        setIsSubmitting(false);
        return;
      }

      // Validate using Zod schema - provide all required fields
      // For edit mode, if no new images are uploaded but we have existing previews, create dummy files for validation
      const validationMainImages = isEditMode && mainImages.length === 0 && mainImagePreviews.length > 0
        ? [new File([], 'existing-image')] // Dummy file for validation
        : mainImages;

      const validationImages = isEditMode && images.length === 0 && imagePreviews.length > 0
        ? [new File([], 'existing-image')] // Dummy file for validation
        : images;

      // Helper function to filter out empty items from arrays
      const filterEmptyItems = (items: any[]) => {
        return items.filter(item => item.name && item.name.trim() !== '');
      };

      // Clean itinerary data by removing empty array items
      const cleanedItinerary = hasItinerary ? {
        ...itinerary,
        startPoint: {
          ...itinerary.startPoint,
          highlights: itinerary.startPoint.highlights?.length > 0
            ? filterEmptyItems(itinerary.startPoint.highlights)
            : undefined,
          thingsToDo: itinerary.startPoint.thingsToDo?.length > 0
            ? filterEmptyItems(itinerary.startPoint.thingsToDo)
            : undefined,
          nearbyThingsToDo: itinerary.startPoint.nearbyThingsToDo?.length > 0
            ? filterEmptyItems(itinerary.startPoint.nearbyThingsToDo)
            : undefined,
        },
        points: itinerary.points.map(point => ({
          ...point,
          highlights: point.highlights?.length > 0
            ? filterEmptyItems(point.highlights)
            : undefined,
          thingsToDo: point.thingsToDo?.length > 0
            ? filterEmptyItems(point.thingsToDo)
            : undefined,
          nearbyThingsToDo: point.nearbyThingsToDo?.length > 0
            ? filterEmptyItems(point.nearbyThingsToDo)
            : undefined,
        })),
      } : undefined;

      const formDataToValidate: ExperienceFormData = {
        title,
        description,
        price: parseFloat(price.toString()),
        isOnSale,
        oldPrice: isOnSale ? parseFloat(oldPrice.toString()) : undefined,
        adultPrice: parseFloat(adultPrice.toString()),
        childPrice: parseFloat(childPrice.toString()),
        infantPrice: parseFloat(infantPrice.toString()),
        totalLimit: parseInt(totalLimit.toString()),
        mainImages: validationMainImages,
        images: validationImages,
        tagsOnCard,
        cardType: isMainCard ? "main" : isTopExperience ? "top" : isMustDo ? "must" : isPopular ? "popular" : "main",
        isMainCard,
        isTopExperience,
        isMustDo,
        isPopular,
        duration,
        openToday,
        freeCancellation,
        bookNowPayLater,
        guidedTour,
        highlights,
        inclusions,
        exclusions,
        cancellationPolicy,
        youExperience,
        knowBeforeYouGo,
        myTickets,
        exploreMore,
        blogSlugs,
        operatingHours,
        datePriceRange,
        whereTo: {
          address,
          lat: parseFloat(latitude.toString()),
          lng: parseFloat(longitude.toString()),
        },
        packageType,
        // Only include itinerary if the checkbox is checked, and clean empty items
        ...(cleanedItinerary && { itinerary: cleanedItinerary }),
      };

      const validation = experienceFormSchema.safeParse(formDataToValidate);
      if (!validation.success) {
        const validationErrors: { [key: string]: string } = {};
        validation.error.errors.forEach((error) => {
          const field = error.path.join('.');
          validationErrors[field] = error.message;
        });
        setExperienceValidationErrors(validationErrors);
        setSubmitError('Please fix the validation errors above.');
        setIsSubmitting(false);
        return;
      }
      // Create FormData object
      const formData = new FormData();

      // Add selected IDs
      if (selectedCity) formData.append('cityId', selectedCity._id);
      if (selectedCategory) formData.append('categoryId', selectedCategory._id);
      if (selectedSubcategory) formData.append('subcategoryId', selectedSubcategory._id);

      // Add basic string fields
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price.toString());
      if (oldPrice) formData.append('oldPrice', oldPrice.toString());
      formData.append('adultPrice', adultPrice.toString());
      formData.append('childPrice', childPrice.toString());
      formData.append('infantPrice', infantPrice.toString());
      formData.append('totalLimit', totalLimit.toString());
      formData.append('tagOnCards', tagsOnCard);

      // Card type based on selection
      formData.append('isMainCard', isMainCard.toString());
      formData.append('isTopExperience', isTopExperience.toString());
      formData.append('isMustDo', isMustDo.toString());
      formData.append('isPopular', isPopular.toString());

      // Structured features as array of strings
      const features = [
        duration,
        openToday,
        freeCancellation,
        bookNowPayLater,
        guidedTour,
      ];
      formData.append('features', JSON.stringify(features));

      // WYSIWYG content fields
      formData.append('highlights', highlights);
      formData.append('inclusions', inclusions);
      formData.append('exclusions', exclusions);
      formData.append('cancellationPolicy', cancellationPolicy);
      formData.append('youExperience', youExperience);
      formData.append('knowBeforeYouGo', knowBeforeYouGo);
      formData.append('myTickets', myTickets);
      formData.append('exploreMore', exploreMore);

      // // Add blog slugs as JSON string
      formData.append('blogSlug', JSON.stringify(blogSlugs));

      // Add complex objects as JSON strings
      formData.append('operatingHours', JSON.stringify(operatingHours));
      formData.append('datePriceRange', JSON.stringify(datePriceRange));
      formData.append('whereTo', JSON.stringify({
        address,
        lat: latitude,
        lng: longitude,
      }));
      formData.append('packageType', JSON.stringify(packageType));

      // // Add itinerary if enabled
      if (hasItinerary) {
        formData.append('itinerary', JSON.stringify(itinerary));
      }

      // Add main images (backend expects 'mainImage' field name)
      // Only append new images in edit mode, or all images in create mode
      if (!isEditMode || mainImages.length > 0) {
        mainImages.forEach((file, index) => {
          if (file instanceof File) {
            formData.append('mainImage', file);
          }
        });
      }

      // Add regular images
      // Only append new images in edit mode, or all images in create mode
      if (!isEditMode || images.length > 0) {
        images.forEach((file, index) => {
          if (file instanceof File) {
            formData.append('images', file);
          }
        });
      }

      // // Add itinerary images if they exist
      if (hasItinerary) {
        // Start point image
        if (startPointImage) {
          formData.append('startPointImage', startPointImage);
        }

        // End point image
        if (endPointImage) {
          formData.append('endPointImage', endPointImage);
        }

        // Point images
        pointImages.forEach((file, index) => {
          if (file) {
            formData.append(`pointImages_${index}`, file);
          }
        });

        // Nearby images (nested arrays)
        nearbyImages.forEach((pointArray, pointIndex) => {
          pointArray.forEach((file, nearbyIndex) => {
            if (file) {
              formData.append(`nearbyImages_${pointIndex}_${nearbyIndex}`, file);
            }
          });
        });

        // Highlights images (nested arrays)
        highlightsImages.forEach((pointArray, pointIndex) => {
          pointArray.forEach((file, highlightIndex) => {
            if (file) {
              formData.append(`highlightsImages_${pointIndex}_${highlightIndex}`, file);
            }
          });
        });

        // Things to do images (nested arrays)
        thingsImages.forEach((pointArray, pointIndex) => {
          pointArray.forEach((file, thingIndex) => {
            if (file) {
              formData.append(`thingsImages_${pointIndex}_${thingIndex}`, file);
            }
          });
        });
      }

      // Call the appropriate API based on edit mode
      const response = isEditMode && experienceId
        ? await updateExperience(experienceId, formData)
        : await createExperience(formData);

      setSubmitSuccess(true);

      // Show success message briefly then call onSuccess or redirect
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(); // Call the success callback to refresh the list and navigate back
        } else {
          router.push('/dashboard');
        }
      }, 2000); // Wait 2 seconds to show success message

    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} experience:`, error);

      if (error.errors) {
        // Handle Zod validation errors
        const validationErrors: { [key: string]: string } = {};
        error.errors.forEach((err: any) => {
          const field = err.path.join('.');
          validationErrors[field] = err.message;
        });
        setExperienceValidationErrors(validationErrors);
        setSubmitError('Please fix the validation errors above.');
      } else if (error.message) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Failed to create experience. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Top Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Experiences</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">
                New Experience
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={fillSampleData}
                disabled={isSubmitting}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
              >
                Fill Sample Data
              </Button>
              <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Experience" : "Save Experience")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-[800px] mx-auto px-[24px] xl:px-0 py-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Experience Details
            </h2>

            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-green-600">
                      Experience {isEditMode ? 'updated' : 'created'} successfully!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-red-600 mb-2">
                      {submitError}
                    </p>
                    {Object.keys(experienceValidationErrors).length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-red-700 mb-2">Please fix the following errors:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs text-red-600">
                          {Object.entries(experienceValidationErrors).map(([field, error]) => (
                            <li key={field}>
                              <span className="font-medium">{field}:</span> {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* City Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>

                {loading ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                    <span className="text-gray-500">Loading cities...</span>
                  </div>
                ) : error ? (
                  <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50">
                    <span className="text-red-600">{error}</span>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-3 hover:cursor-pointer py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent flex items-center justify-between"
                    >
                      <span
                        className={
                          selectedCity ? "text-gray-900" : "text-gray-500"
                        }
                      >
                        {selectedCity
                          ? `${selectedCity.cityName}, ${selectedCity.countryName}`
                          : "Select a city"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {/* Create New City Option */}
                        <button
                          onClick={handleCreateNewCity}
                          className="w-full hover:cursor-pointer px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 border-b border-gray-200"
                        >
                          <Plus className="w-4 h-4 text-purple-600" />
                          <span className="text-purple-600 font-medium">
                            Create New City
                          </span>
                        </button>

                        {/* Cities List */}
                        {cities.map((city) => (
                          <button
                            key={city._id}
                            onClick={() => handleCitySelect(city)}
                            className="w-full hover:cursor-pointer px-4 py-2 text-left hover:bg-gray-100 text-gray-900"
                          >
                            {city.cityName}, {city.countryName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>

                {loading ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                    <span className="text-gray-500">Loading categories...</span>
                  </div>
                ) : error ? (
                  <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50">
                    <span className="text-red-600">{error}</span>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                      }
                      className="w-full px-3 hover:cursor-pointer py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent flex items-center justify-between"
                    >
                      <span
                        className={
                          selectedCategory ? "text-gray-900" : "text-gray-500"
                        }
                      >
                        {selectedCategory
                          ? selectedCategory.categoryName
                          : "Select a category"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isCategoryDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {/* Categories List */}
                        {categories.map((category) => (
                          <button
                            key={category._id}
                            onClick={() => handleCategorySelect(category)}
                            className="w-full hover:cursor-pointer px-4 py-2 text-left hover:bg-gray-100 text-gray-900"
                          >
                            {category.categoryName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Subcategory Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory <span className="text-red-500">*</span>
                </label>

                {loading ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                    <span className="text-gray-500">
                      Loading subcategories...
                    </span>
                  </div>
                ) : error ? (
                  <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50">
                    <span className="text-red-600">{error}</span>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsSubcategoryDropdownOpen(!isSubcategoryDropdownOpen)
                      }
                      className="w-full px-3 hover:cursor-pointer py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent flex items-center justify-between"
                    >
                      <span
                        className={
                          selectedSubcategory
                            ? "text-gray-900"
                            : "text-gray-500"
                        }
                      >
                        {selectedSubcategory
                          ? selectedSubcategory.subcategoryName
                          : "Select a subcategory"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isSubcategoryDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isSubcategoryDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {/* Create New Subcategory Option */}
                        <button
                          onClick={handleCreateNewSubcategory}
                          className="w-full hover:cursor-pointer px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 border-b border-gray-200"
                        >
                          <Plus className="w-4 h-4 text-purple-600" />
                          <span className="text-purple-600 font-medium">
                            Create New Subcategory
                          </span>
                        </button>

                        {/* Subcategories List */}
                        {subcategories.map((subcategory) => (
                          <button
                            key={subcategory._id}
                            onClick={() => handleSubcategorySelect(subcategory)}
                            className="w-full hover:cursor-pointer px-4 py-2 text-left hover:bg-gray-100 text-gray-900"
                          >
                            {subcategory.subcategoryName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Experience Details Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Experience Information
                </h3>

                {/* Title Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      experienceValidationErrors.title
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter experience title"
                  />
                  {experienceValidationErrors.title && (
                    <p className="text-sm text-red-600 mt-1">
                      {experienceValidationErrors.title}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      experienceValidationErrors.description
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter experience description"
                  />
                  {experienceValidationErrors.description && (
                    <p className="text-sm text-red-600 mt-1">
                      {experienceValidationErrors.description}
                    </p>
                  )}
                </div>

                {/* Sale Checkbox */}
                <div className="mb-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isOnSale}
                      onChange={handleSaleToggle}
                      className="w-4 h-4 hover:cursor-pointer text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      On Sale
                    </span>
                  </label>
                </div>

                {/* Price Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price === 0 ? "" : price}
                        onChange={(e) =>
                          setPrice(
                            e.target.value ? parseFloat(e.target.value) : 0
                          )
                        }
                        className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          experienceValidationErrors.price
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {experienceValidationErrors.price && (
                      <p className="text-sm text-red-600 mt-1">
                        {experienceValidationErrors.price}
                      </p>
                    )}
                  </div>

                  {/* Old Price (only shown when on sale) */}
                  {isOnSale && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Old Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={oldPrice === 0 ? "" : oldPrice}
                          onChange={(e) =>
                            setOldPrice(
                              e.target.value ? parseFloat(e.target.value) : 0
                            )
                          }
                          className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            experienceValidationErrors.oldPrice
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="0.00"
                        />
                      </div>
                      {experienceValidationErrors.oldPrice && (
                        <p className="text-sm text-red-600 mt-1">
                          {experienceValidationErrors.oldPrice}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Pricing Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Adult Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adult Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={adultPrice === 0 ? "" : adultPrice}
                        onChange={(e) =>
                          setAdultPrice(
                            e.target.value ? parseFloat(e.target.value) : 0
                          )
                        }
                        className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          experienceValidationErrors.adultPrice
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {experienceValidationErrors.adultPrice && (
                      <p className="text-sm text-red-600 mt-1">
                        {experienceValidationErrors.adultPrice}
                      </p>
                    )}
                  </div>

                  {/* Child Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Child Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={childPrice === 0 ? "" : childPrice}
                        onChange={(e) =>
                          setChildPrice(
                            e.target.value ? parseFloat(e.target.value) : 0
                          )
                        }
                        className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          experienceValidationErrors.childPrice
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {experienceValidationErrors.childPrice && (
                      <p className="text-sm text-red-600 mt-1">
                        {experienceValidationErrors.childPrice}
                      </p>
                    )}
                  </div>

                  {/* Senior Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Infant Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={infantPrice === 0 ? "" : infantPrice}
                        onChange={(e) =>
                          setinfantPrice(
                            e.target.value ? parseFloat(e.target.value) : 0
                          )
                        }
                        className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          experienceValidationErrors.infantPrice
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {experienceValidationErrors.infantPrice && (
                      <p className="text-sm text-red-600 mt-1">
                        {experienceValidationErrors.infantPrice}
                      </p>
                    )}
                  </div>

                  {/* Total Limit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Ticket Limit <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={totalLimit === 0 ? "" : totalLimit}
                      onChange={(e) =>
                        setTotalLimit(
                          e.target.value ? parseInt(e.target.value) : 0
                        )
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        experienceValidationErrors.totalLimit
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter maximum number of tickets"
                    />
                    {experienceValidationErrors.totalLimit && (
                      <p className="text-sm text-red-600 mt-1">
                        {experienceValidationErrors.totalLimit}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tags and Card Type Section */}
                <div className="mt-8 ">
                  {/* Tags on Card */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags on Card <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={tagsOnCard}
                      onChange={(e) => setTagsOnCard(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        experienceValidationErrors.tagsOnCard
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter tags for the card (e.g., Adventure, Family Fun, etc.)"
                    />
                    {experienceValidationErrors.tagsOnCard && (
                      <p className="text-sm text-red-600 mt-1">
                        {experienceValidationErrors.tagsOnCard}
                      </p>
                    )}
                  </div>

                  {/* Card Type Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Card Type <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Select exactly one card type:
                    </p>

                    <div className="space-y-3">
                      {/* Main Card */}
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="cardType"
                          checked={isMainCard}
                          onChange={() => {
                            setIsMainCard(true);
                            setIsTopExperience(false);
                            setIsMustDo(false);
                            setIsPopular(false);
                          }}
                          className="w-4 h-4 hover:cursor-pointer bg-gray-100 border-gray-300 "
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Main Card
                        </span>
                      </label>

                      {/* Top Experience */}
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="cardType"
                          checked={isTopExperience}
                          onChange={() => {
                            setIsMainCard(false);
                            setIsTopExperience(true);
                            setIsMustDo(false);
                            setIsPopular(false);
                          }}
                          className="w-4 h-4 hover:cursor-pointer bg-gray-100 border-gray-300 "
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Top Experience
                        </span>
                      </label>

                      {/* Must Do */}
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="cardType"
                          checked={isMustDo}
                          onChange={() => {
                            setIsMainCard(false);
                            setIsTopExperience(false);
                            setIsMustDo(true);
                            setIsPopular(false);
                          }}
                          className="w-4 h-4 hover:cursor-pointer bg-gray-100 border-gray-300 "
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Must Do
                        </span>
                      </label>

                      {/* Popular */}
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="cardType"
                          checked={isPopular}
                          onChange={() => {
                            setIsMainCard(false);
                            setIsTopExperience(false);
                            setIsMustDo(false);
                            setIsPopular(true);
                          }}
                          className="w-4 h-4 hover:cursor-pointer bg-gray-100 border-gray-300 "
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Popular
                        </span>
                      </label>
                    </div>

                    {experienceValidationErrors.cardType && (
                      <p className="text-sm text-red-600 mt-2">
                        {experienceValidationErrors.cardType}
                      </p>
                    )}
                  </div>

                  {/* Features Section */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Features
                    </label>
                    <p className="text-xs text-gray-500 mb-4">
                      Fill in the feature details. Leave empty if not
                      applicable.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Duration */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., 1.5hr"
                        />
                        {experienceValidationErrors["duration"] && (
                          <p className="text-xs text-red-600 mt-1">
                            {experienceValidationErrors["duration"]}
                          </p>
                        )}
                      </div>

                      {/* Open Today */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Open Today
                        </label>
                        <input
                          type="text"
                          value={openToday}
                          onChange={(e) => setOpenToday(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., 11:00am - 5:00pm"
                        />
                        {experienceValidationErrors["openToday"] && (
                          <p className="text-xs text-red-600 mt-1">
                            {experienceValidationErrors["openToday"]}
                          </p>
                        )}
                      </div>

                      {/* Free Cancellation */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Free Cancellation
                        </label>
                        <input
                          type="text"
                          value={freeCancellation}
                          onChange={(e) => setFreeCancellation(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., Non-refundable"
                        />
                        {experienceValidationErrors["freeCancellation"] && (
                          <p className="text-xs text-red-600 mt-1">
                            {experienceValidationErrors["freeCancellation"]}
                          </p>
                        )}
                      </div>

                      {/* Book Now Pay Later */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Book Now Pay Later
                        </label>
                        <input
                          type="text"
                          value={bookNowPayLater}
                          onChange={(e) => setBookNowPayLater(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., Print at home"
                        />
                        {experienceValidationErrors["bookNowPayLater"] && (
                          <p className="text-xs text-red-600 mt-1">
                            {experienceValidationErrors["bookNowPayLater"]}
                          </p>
                        )}
                      </div>

                      {/* Guided Tour */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Guided Tour
                        </label>
                        <input
                          type="text"
                          value={guidedTour}
                          onChange={(e) => setGuidedTour(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., Small Group"
                        />
                        {experienceValidationErrors["guidedTour"] && (
                          <p className="text-xs text-red-600 mt-1">
                            {experienceValidationErrors["guidedTour"]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Operating Hours Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Operating Hours <span className="text-red-500">*</span>
                      </label>
                      <Button
                        type="button"
                        onClick={addOperatingHour}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Hours</span>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {operatingHours.map((hour, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-700">
                              Schedule #{index + 1}
                            </h4>
                            {operatingHours.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeOperatingHour(index)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {/* Title */}
                            <div className="lg:col-span-3">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={hour.title}
                                onChange={(e) =>
                                  updateOperatingHour(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                  experienceValidationErrors[
                                    `operatingHours.${index}.title`
                                  ]
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                                placeholder="e.g., Regular Hours, Summer Hours"
                              />
                            </div>

                            {/* Start Date */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Start Date{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                value={hour.startDate}
                                onChange={(e) =>
                                  updateOperatingHour(
                                    index,
                                    "startDate",
                                    e.target.value
                                  )
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                  experienceValidationErrors[
                                    `operatingHours.${index}.startDate`
                                  ]
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>

                            {/* End Date */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                End Date <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                value={hour.endDate}
                                onChange={(e) =>
                                  updateOperatingHour(
                                    index,
                                    "endDate",
                                    e.target.value
                                  )
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                  experienceValidationErrors[
                                    `operatingHours.${index}.endDate`
                                  ]
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>

                            {/* Open Time */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Open Time{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="time"
                                value={hour.openTime}
                                onChange={(e) =>
                                  updateOperatingHour(
                                    index,
                                    "openTime",
                                    e.target.value
                                  )
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                  experienceValidationErrors[
                                    `operatingHours.${index}.openTime`
                                  ]
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>

                            {/* Close Time */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Close Time{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="time"
                                value={hour.closeTime}
                                onChange={(e) =>
                                  updateOperatingHour(
                                    index,
                                    "closeTime",
                                    e.target.value
                                  )
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                  experienceValidationErrors[
                                    `operatingHours.${index}.closeTime`
                                  ]
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>

                            {/* Last Entry Time */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Last Entry Time{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="time"
                                value={hour.lastEntryTime}
                                onChange={(e) =>
                                  updateOperatingHour(
                                    index,
                                    "lastEntryTime",
                                    e.target.value
                                  )
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                  experienceValidationErrors[
                                    `operatingHours.${index}.lastEntryTime`
                                  ]
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Excluded Days */}
                          <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                              Exclude Days (Optional)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                              {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => (
                                <label
                                  key={day}
                                  className="flex items-center space-x-2 px-3 py-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={hour.excludedDays?.includes(day) || false}
                                    onChange={(e) => {
                                      const newExcludedDays = e.target.checked
                                        ? [...(hour.excludedDays || []), day]
                                        : (hour.excludedDays || []).filter(d => d !== day);
                                      updateOperatingHour(index, 'excludedDays', newExcludedDays);
                                    }}
                                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                  />
                                  <span className="text-xs capitalize">{day.substring(0, 3)}</span>
                                </label>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Select days to exclude from this schedule. The experience will not be available on excluded days.
                            </p>
                          </div>

                          {/* Show validation errors for this operating hour */}
                          {Object.keys(experienceValidationErrors)
                            .filter((key) =>
                              key.startsWith(`operatingHours.${index}.`)
                            )
                            .map((key) => (
                              <p
                                key={key}
                                className="text-sm text-red-600 mt-2"
                              >
                                {experienceValidationErrors[key]}
                              </p>
                            ))}
                        </div>
                      ))}
                    </div>

                    {experienceValidationErrors.operatingHours && (
                      <p className="text-sm text-red-600 mt-2">
                        {experienceValidationErrors.operatingHours}
                      </p>
                    )}
                  </div>

                  {/* Date Price Range Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Date Price Range <span className="text-red-500">*</span>
                      </label>
                      <Button
                        type="button"
                        onClick={addDatePriceRange}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Price Range</span>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {datePriceRange.map((range, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-700">
                              Price Range #{index + 1}
                            </h4>
                            {datePriceRange.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeDatePriceRange(index)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Start Date */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Start Date{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                value={range.startDate}
                                onChange={(e) =>
                                  updateDatePriceRange(
                                    index,
                                    "startDate",
                                    e.target.value
                                  )
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                  experienceValidationErrors[
                                    `datePriceRange.${index}.startDate`
                                  ]
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>

                            {/* End Date */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                End Date <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                value={range.endDate}
                                onChange={(e) =>
                                  updateDatePriceRange(
                                    index,
                                    "endDate",
                                    e.target.value
                                  )
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                  experienceValidationErrors[
                                    `datePriceRange.${index}.endDate`
                                  ]
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>

                            {/* Price */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Price <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">
                                  $
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={range.price === 0 ? "" : range.price}
                                  onChange={(e) =>
                                    updateDatePriceRange(
                                      index,
                                      "price",
                                      e.target.value
                                        ? parseFloat(e.target.value)
                                        : 0
                                    )
                                  }
                                  className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                    experienceValidationErrors[
                                      `datePriceRange.${index}.price`
                                    ]
                                      ? "border-red-300"
                                      : "border-gray-300"
                                  }`}
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Show validation errors for this date price range */}
                          {Object.keys(experienceValidationErrors)
                            .filter((key) =>
                              key.startsWith(`datePriceRange.${index}.`)
                            )
                            .map((key) => (
                              <p
                                key={key}
                                className="text-sm text-red-600 mt-2"
                              >
                                {experienceValidationErrors[key]}
                              </p>
                            ))}
                        </div>
                      ))}
                    </div>

                    {experienceValidationErrors.datePriceRange && (
                      <p className="text-sm text-red-600 mt-2">
                        {experienceValidationErrors.datePriceRange}
                      </p>
                    )}
                  </div>

                  {/* Location Section */}
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-800 mb-4">
                      Location (Where To){" "}
                      <span className="text-red-500">*</span>
                    </h4>

                    {/* Address */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          experienceValidationErrors.address
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter the full address"
                      />
                      {experienceValidationErrors.address && (
                        <p className="text-sm text-red-600 mt-1">
                          {experienceValidationErrors.address}
                        </p>
                      )}
                    </div>

                    {/* Latitude and Longitude */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Latitude */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Latitude <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="any"
                          min="-90"
                          max="90"
                          value={latitude === 0 ? "" : latitude}
                          onChange={(e) =>
                            setLatitude(
                              e.target.value ? parseFloat(e.target.value) : 0
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            experienceValidationErrors.lat
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="e.g., 40.7128"
                        />
                        {experienceValidationErrors.lat && (
                          <p className="text-sm text-red-600 mt-1">
                            {experienceValidationErrors.lat}
                          </p>
                        )}
                      </div>

                      {/* Longitude */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Longitude <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="any"
                          min="-180"
                          max="180"
                          value={longitude === 0 ? "" : longitude}
                          onChange={(e) =>
                            setLongitude(
                              e.target.value ? parseFloat(e.target.value) : 0
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            experienceValidationErrors.lng
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="e.g., -74.0060"
                        />
                        {experienceValidationErrors.lng && (
                          <p className="text-sm text-red-600 mt-1">
                            {experienceValidationErrors.lng}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* General whereTo validation error */}
                    {experienceValidationErrors.whereTo && (
                      <p className="text-sm text-red-600 mt-2">
                        {experienceValidationErrors.whereTo}
                      </p>
                    )}
                  </div>

                  {/* Package Type Section */}
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-800 mb-4">
                      Package Type <span className="text-red-500">*</span>
                    </h4>

                    {/* Package Name */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Package Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={packageType.name}
                        onChange={(e) =>
                          updatePackageType("name", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          experienceValidationErrors["packageType.name"]
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="e.g., Standard Package"
                      />
                      {experienceValidationErrors["packageType.name"] && (
                        <p className="text-sm text-red-600 mt-1">
                          {experienceValidationErrors["packageType.name"]}
                        </p>
                      )}
                    </div>

                    {/* Package Price */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Package Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            packageType.price === 0 ? "" : packageType.price
                          }
                          onChange={(e) =>
                            updatePackageType(
                              "price",
                              e.target.value ? parseFloat(e.target.value) : 0
                            )
                          }
                          className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            experienceValidationErrors["packageType.price"]
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="0.00"
                        />
                      </div>
                      {experienceValidationErrors["packageType.price"] && (
                        <p className="text-sm text-red-600 mt-1">
                          {experienceValidationErrors["packageType.price"]}
                        </p>
                      )}
                    </div>

                    {/* Points */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Package Points <span className="text-red-500">*</span>
                        </label>
                        <Button
                          type="button"
                          onClick={addPoint}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Point</span>
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {packageType.points.map((point, pointIndex) => (
                          <div
                            key={pointIndex}
                            className="p-4 border border-gray-200 rounded-md bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-700">
                                Point {pointIndex + 1}
                              </span>
                              {packageType.points.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => removePoint(pointIndex)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Plus className="w-4 h-4 rotate-45" />
                                </Button>
                              )}
                            </div>

                            {/* Point Title */}
                            <div className="mb-3">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Point Title{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={point.title}
                                onChange={(e) =>
                                  updatePoint(
                                    pointIndex,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                  experienceValidationErrors[
                                    `packageType.points.${pointIndex}.title`
                                  ]
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                                placeholder="e.g., Included in Package"
                              />
                              {experienceValidationErrors[
                                `packageType.points.${pointIndex}.title`
                              ] && (
                                <p className="text-xs text-red-600 mt-1">
                                  {
                                    experienceValidationErrors[
                                      `packageType.points.${pointIndex}.title`
                                    ]
                                  }
                                </p>
                              )}
                            </div>

                            {/* Subpoints - Only for second point */}
                            {pointIndex === 1 && (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="block text-xs font-medium text-gray-600">
                                    Subpoints (Max 5)
                                  </label>
                                  {(!point.subpoints ||
                                    point.subpoints.length < 5) && (
                                    <Button
                                      type="button"
                                      onClick={() => addSubpoint(pointIndex)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs text-purple-600 hover:text-purple-700"
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add Subpoint
                                    </Button>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  {point.subpoints?.map(
                                    (subpoint, subpointIndex) => (
                                      <div
                                        key={subpointIndex}
                                        className="flex items-center space-x-2"
                                      >
                                        <input
                                          type="text"
                                          value={subpoint}
                                          onChange={(e) =>
                                            updateSubpoint(
                                              pointIndex,
                                              subpointIndex,
                                              e.target.value
                                            )
                                          }
                                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                          placeholder="e.g., Professional guide"
                                        />
                                        {point.subpoints &&
                                          point.subpoints.length > 1 && (
                                            <Button
                                              type="button"
                                              onClick={() =>
                                                removeSubpoint(
                                                  pointIndex,
                                                  subpointIndex
                                                )
                                              }
                                              variant="ghost"
                                              size="sm"
                                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                                            >
                                              <Plus className="w-3 h-3 rotate-45" />
                                            </Button>
                                          )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {experienceValidationErrors["packageType.points"] && (
                        <p className="text-sm text-red-600 mt-2">
                          {experienceValidationErrors["packageType.points"]}
                        </p>
                      )}
                    </div>

                    {/* Time Price Slots */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Time Price Slots{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Button
                          type="button"
                          onClick={addTimePriceSlot}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Time Slot</span>
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {packageType.timePriceSlots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="p-4 border border-gray-200 rounded-md bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-700">
                                Time Slot {slotIndex + 1}
                              </span>
                              {packageType.timePriceSlots.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => removeTimePriceSlot(slotIndex)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <CrossIcon className="w-4 h-4" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Open Time */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Open Time{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="time"
                                  value={slot.openTime}
                                  onChange={(e) =>
                                    updateTimePriceSlot(
                                      slotIndex,
                                      "openTime",
                                      e.target.value
                                    )
                                  }
                                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                    experienceValidationErrors[
                                      `packageType.timePriceSlots.${slotIndex}.openTime`
                                    ]
                                      ? "border-red-300"
                                      : "border-gray-300"
                                  }`}
                                />
                                {experienceValidationErrors[
                                  `packageType.timePriceSlots.${slotIndex}.openTime`
                                ] && (
                                  <p className="text-xs text-red-600 mt-1">
                                    {
                                      experienceValidationErrors[
                                        `packageType.timePriceSlots.${slotIndex}.openTime`
                                      ]
                                    }
                                  </p>
                                )}
                              </div>

                              {/* Close Time */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Close Time{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="time"
                                  value={slot.closeTime}
                                  onChange={(e) =>
                                    updateTimePriceSlot(
                                      slotIndex,
                                      "closeTime",
                                      e.target.value
                                    )
                                  }
                                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                    experienceValidationErrors[
                                      `packageType.timePriceSlots.${slotIndex}.closeTime`
                                    ]
                                      ? "border-red-300"
                                      : "border-gray-300"
                                  }`}
                                />
                                {experienceValidationErrors[
                                  `packageType.timePriceSlots.${slotIndex}.closeTime`
                                ] && (
                                  <p className="text-xs text-red-600 mt-1">
                                    {
                                      experienceValidationErrors[
                                        `packageType.timePriceSlots.${slotIndex}.closeTime`
                                      ]
                                    }
                                  </p>
                                )}
                              </div>

                              {/* Price */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Price <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2 text-gray-500 text-sm">
                                    $
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={slot.price === 0 ? "" : slot.price}
                                    onChange={(e) =>
                                      updateTimePriceSlot(
                                        slotIndex,
                                        "price",
                                        e.target.value
                                          ? parseFloat(e.target.value)
                                          : 0
                                      )
                                    }
                                    className={`w-full pl-8 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                      experienceValidationErrors[
                                        `packageType.timePriceSlots.${slotIndex}.price`
                                      ]
                                        ? "border-red-300"
                                        : "border-gray-300"
                                    }`}
                                    placeholder="0.00"
                                  />
                                </div>
                                {experienceValidationErrors[
                                  `packageType.timePriceSlots.${slotIndex}.price`
                                ] && (
                                  <p className="text-xs text-red-600 mt-1">
                                    {
                                      experienceValidationErrors[
                                        `packageType.timePriceSlots.${slotIndex}.price`
                                      ]
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {experienceValidationErrors[
                        "packageType.timePriceSlots"
                      ] && (
                        <p className="text-sm text-red-600 mt-2">
                          {
                            experienceValidationErrors[
                              "packageType.timePriceSlots"
                            ]
                          }
                        </p>
                      )}
                    </div>

                    {/* General packageType validation error */}
                    {experienceValidationErrors.packageType && (
                      <p className="text-sm text-red-600 mt-2">
                        {experienceValidationErrors.packageType}
                      </p>
                    )}
                  </div>

                  {/* Itinerary Section */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <input
                        type="checkbox"
                        id="hasItinerary"
                        checked={hasItinerary}
                        onChange={(e) => setHasItinerary(e.target.checked)}
                        className="w-4 h-4 hover:cursor-pointer text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <label
                        htmlFor="hasItinerary"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Add Itinerary
                      </label>
                    </div>

                    {hasItinerary && (
                      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h4 className="text-md font-semibold text-gray-800 mb-4">
                          Itinerary Details
                        </h4>

                        {/* Itinerary Title */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={itinerary.title}
                            onChange={(e) =>
                              updateItinerary("title", e.target.value)
                            }
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              experienceValidationErrors["itinerary.title"]
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                            placeholder="e.g., Full Day City Tour"
                          />
                          {experienceValidationErrors["itinerary.title"] && (
                            <p className="text-sm text-red-600 mt-1">
                              {experienceValidationErrors["itinerary.title"]}
                            </p>
                          )}
                        </div>

                        {/* Total Duration and Mode of Transport */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Total Duration
                            </label>
                            <input
                              type="text"
                              value={itinerary.totalDuration}
                              onChange={(e) =>
                                updateItinerary("totalDuration", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="e.g., 8 hours"
                            />
                            {experienceValidationErrors["itinerary.totalDuration"] && (
                              <p className="text-xs text-red-600 mt-1">
                                {experienceValidationErrors["itinerary.totalDuration"]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Mode of Transport
                            </label>
                            <input
                              type="text"
                              value={itinerary.modeOfTransport}
                              onChange={(e) =>
                                updateItinerary(
                                  "modeOfTransport",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="e.g., Bus, Walking"
                            />
                            {experienceValidationErrors["itinerary.modeOfTransport"] && (
                              <p className="text-xs text-red-600 mt-1">
                                {experienceValidationErrors["itinerary.modeOfTransport"]}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Start Point */}
                        <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-white">
                          <h5 className="text-sm font-semibold text-gray-800 mb-3">
                            Start Point <span className="text-red-500">*</span>
                          </h5>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={itinerary.startPoint.name}
                                onChange={(e) =>
                                  updateStartPoint("name", e.target.value)
                                }
                                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                  experienceValidationErrors[
                                    "itinerary.startPoint.name"
                                  ]
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                                placeholder="Starting location name"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Duration
                              </label>
                              <input
                                type="text"
                                value={itinerary.startPoint.duration}
                                onChange={(e) =>
                                  updateStartPoint("duration", e.target.value)
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 1 hour"
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Description
                            </label>
                            <textarea
                              value={itinerary.startPoint.description}
                              onChange={(e) =>
                                updateStartPoint("description", e.target.value)
                              }
                              rows={2}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Describe the starting point"
                            />
                          </div>

                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Image
                            </label>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={handleStartPointImageSelect}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Max file size: 5MB. Supported formats: JPEG, PNG,
                              WebP
                            </p>

                            {startPointImageError && (
                              <p className="text-xs text-red-600 mt-1">
                                {startPointImageError}
                              </p>
                            )}

                            {startPointImagePreview && (
                              <div className="relative mt-3">
                                <img
                                  src={startPointImagePreview}
                                  alt="Start Point Preview"
                                  className="w-full h-32 object-cover rounded-md border border-gray-300"
                                />
                                <button
                                  type="button"
                                  onClick={removeStartPointImage}
                                  className="absolute hover:cursor-pointer top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                  <PlusIcon className="w-4 h-4 rotate-45" />
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Address
                              </label>
                              <input
                                type="text"
                                value={itinerary.startPoint.location.address}
                                onChange={(e) =>
                                  updateStartPointLocation(
                                    "address",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Full address"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Latitude
                              </label>
                              <input
                                type="number"
                                step="any"
                                value={
                                  itinerary.startPoint.location.lat === 0
                                    ? ""
                                    : itinerary.startPoint.location.lat
                                }
                                onChange={(e) =>
                                  updateStartPointLocation(
                                    "lat",
                                    e.target.value
                                      ? parseFloat(e.target.value)
                                      : 0
                                  )
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="40.7128"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Longitude
                              </label>
                              <input
                                type="number"
                                step="any"
                                value={
                                  itinerary.startPoint.location.lng === 0
                                    ? ""
                                    : itinerary.startPoint.location.lng
                                }
                                onChange={(e) =>
                                  updateStartPointLocation(
                                    "lng",
                                    e.target.value
                                      ? parseFloat(e.target.value)
                                      : 0
                                  )
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="-74.0060"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Itinerary Points */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-sm font-semibold text-gray-800">
                              Itinerary Points
                            </h5>
                            <Button
                              type="button"
                              onClick={addItineraryPoint}
                              variant="outline"
                              size="sm"
                              className="flex items-center space-x-1"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add Point</span>
                            </Button>
                          </div>

                          <div className="space-y-4">
                            {itinerary.points.map((point, index) => (
                              <div
                                key={index}
                                className="p-4 border border-gray-300 rounded-lg bg-white"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h6 className="text-sm font-medium text-gray-700">
                                    Point {point.order}
                                  </h6>
                                  {itinerary.points.length > 1 && (
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        removeItineraryPoint(index)
                                      }
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Name{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={point.name}
                                      onChange={(e) =>
                                        updateItineraryPoint(
                                          index,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                      placeholder="Point name"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Duration
                                    </label>
                                    <input
                                      type="text"
                                      value={point.duration}
                                      onChange={(e) =>
                                        updateItineraryPoint(
                                          index,
                                          "duration",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                      placeholder="e.g., 2 hours"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Distance
                                    </label>
                                    <input
                                      type="text"
                                      value={point.distance}
                                      onChange={(e) =>
                                        updateItineraryPoint(
                                          index,
                                          "distance",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                      placeholder="e.g., 5 km"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Travel Time
                                    </label>
                                    <input
                                      type="text"
                                      value={point.travelTime}
                                      onChange={(e) =>
                                        updateItineraryPoint(
                                          index,
                                          "travelTime",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                      placeholder="e.g., 15 minutes"
                                    />
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Description
                                  </label>
                                  <textarea
                                    value={point.description}
                                    onChange={(e) =>
                                      updateItineraryPoint(
                                        index,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    rows={2}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Describe this point"
                                  />
                                </div>

                                <div className="mb-3">
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Image
                                  </label>
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={(e) =>
                                      handlePointImageSelect(index, e)
                                    }
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:cursor-pointer"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Max file size: 5MB. Supported formats: JPEG,
                                    PNG, WebP
                                  </p>

                                  {pointImageErrors[index] && (
                                    <p className="text-xs text-red-600 mt-1">
                                      {pointImageErrors[index]}
                                    </p>
                                  )}

                                  {pointImagePreviews[index] && (
                                    <div className="relative mt-3">
                                      <img
                                        src={pointImagePreviews[index]!}
                                        alt={`Point ${index + 1} Preview`}
                                        className="w-full h-32 object-cover rounded-md border border-gray-300"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removePointImage(index)}
                                        className="absolute hover:cursor-pointer top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                      >
                                        <PlusIcon className="w-4 h-4 rotate-45" />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Address
                                    </label>
                                    <input
                                      type="text"
                                      value={point.location?.address || ""}
                                      onChange={(e) =>
                                        updateItineraryPointLocation(
                                          index,
                                          "address",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                      placeholder="Full address"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Latitude
                                    </label>
                                    <input
                                      type="number"
                                      step="any"
                                      value={
                                        point.location?.lat === 0
                                          ? ""
                                          : point.location?.lat
                                      }
                                      onChange={(e) =>
                                        updateItineraryPointLocation(
                                          index,
                                          "lat",
                                          e.target.value
                                            ? parseFloat(e.target.value)
                                            : 0
                                        )
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                      placeholder="40.7128"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Longitude
                                    </label>
                                    <input
                                      type="number"
                                      step="any"
                                      value={
                                        point.location?.lng === 0
                                          ? ""
                                          : point.location?.lng
                                      }
                                      onChange={(e) =>
                                        updateItineraryPointLocation(
                                          index,
                                          "lng",
                                          e.target.value
                                            ? parseFloat(e.target.value)
                                            : 0
                                        )
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                      placeholder="-74.0060"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Attractions Count
                                    </label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={
                                        point.attractions === 0
                                          ? ""
                                          : point.attractions
                                      }
                                      onChange={(e) =>
                                        updateItineraryPoint(
                                          index,
                                          "attractions",
                                          e.target.value
                                            ? parseInt(e.target.value)
                                            : 0
                                        )
                                      }
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                      placeholder="0"
                                    />
                                  </div>
                                  <div className="flex items-center mt-6">
                                    <input
                                      type="checkbox"
                                      id={`ticketsIncluded-${index}`}
                                      checked={point.ticketsIncluded}
                                      onChange={(e) =>
                                        updateItineraryPoint(
                                          index,
                                          "ticketsIncluded",
                                          e.target.checked
                                        )
                                      }
                                      className="w-4 h-4 hover:cursor-pointer text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                    />
                                    <label
                                      htmlFor={`ticketsIncluded-${index}`}
                                      className="ml-2 text-xs font-medium text-gray-600 cursor-pointer"
                                    >
                                      Tickets Included
                                    </label>
                                  </div>
                                </div>

                                {/* Highlights */}
                                <div className="mt-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-medium text-gray-600">
                                      Highlights
                                    </label>
                                    <Button
                                      type="button"
                                      onClick={() => addPointHighlight(index)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs text-purple-600 hover:text-purple-700"
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add Highlight
                                    </Button>
                                  </div>
                                  <div className="space-y-3">
                                    {point.highlights?.map(
                                      (highlight, highlightIndex) => (
                                        <div
                                          key={highlightIndex}
                                          className="p-3 border border-gray-200 rounded-md bg-gray-50"
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-gray-600">
                                              Highlight {highlightIndex + 1}
                                            </span>
                                            {point.highlights &&
                                              point.highlights.length > 1 && (
                                                <Button
                                                  type="button"
                                                  onClick={() =>
                                                    removePointHighlight(
                                                      index,
                                                      highlightIndex
                                                    )
                                                  }
                                                  variant="ghost"
                                                  size="sm"
                                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                                                >
                                                  <Plus className="w-3 h-3 rotate-45" />
                                                </Button>
                                              )}
                                          </div>

                                          <div className="grid grid-cols-1 gap-2">
                                            <input
                                              type="text"
                                              value={highlight.name}
                                              onChange={(e) =>
                                                updatePointHighlight(
                                                  index,
                                                  highlightIndex,
                                                  "name",
                                                  e.target.value
                                                )
                                              }
                                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                              placeholder="Name (required)"
                                            />
                                            <div>
                                              <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={(e) =>
                                                  handleHighlightImageSelect(
                                                    index,
                                                    highlightIndex,
                                                    e
                                                  )
                                                }
                                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:cursor-pointer"
                                              />
                                              <p className="text-xs text-gray-400 mt-1">
                                                Max 5MB. JPEG, PNG, WebP
                                              </p>

                                              {highlightsImageErrors[index]?.[
                                                highlightIndex
                                              ] && (
                                                <p className="text-xs text-red-600 mt-1">
                                                  {
                                                    highlightsImageErrors[
                                                      index
                                                    ][highlightIndex]
                                                  }
                                                </p>
                                              )}

                                              {highlightsImagePreviews[index]?.[
                                                highlightIndex
                                              ] && (
                                                <div className="relative mt-2">
                                                  <img
                                                    src={
                                                      highlightsImagePreviews[
                                                        index
                                                      ][highlightIndex]!
                                                    }
                                                    alt={`Highlight ${highlightIndex + 1} Preview`}
                                                    className="w-full h-20 object-cover rounded-md border border-gray-300"
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      removeHighlightImage(
                                                        index,
                                                        highlightIndex
                                                      )
                                                    }
                                                    className="absolute hover:cursor-pointer top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                  >
                                                    <PlusIcon className="w-3 h-3 rotate-45" />
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                            <textarea
                                              value={
                                                highlight.description || ""
                                              }
                                              onChange={(e) =>
                                                updatePointHighlight(
                                                  index,
                                                  highlightIndex,
                                                  "description",
                                                  e.target.value
                                                )
                                              }
                                              rows={2}
                                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                              placeholder="Description"
                                            />
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                {/* Things To Do */}
                                <div className="mt-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-medium text-gray-600">
                                      Things To Do
                                    </label>
                                    <Button
                                      type="button"
                                      onClick={() => addPointThingToDo(index)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs text-purple-600 hover:text-purple-700"
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add Thing
                                    </Button>
                                  </div>
                                  <div className="space-y-3">
                                    {point.thingsToDo?.map(
                                      (thing, thingIndex) => (
                                        <div
                                          key={thingIndex}
                                          className="p-3 border border-gray-200 rounded-md bg-gray-50"
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-gray-600">
                                              Thing {thingIndex + 1}
                                            </span>
                                            {point.thingsToDo &&
                                              point.thingsToDo.length > 1 && (
                                                <Button
                                                  type="button"
                                                  onClick={() =>
                                                    removePointThingToDo(
                                                      index,
                                                      thingIndex
                                                    )
                                                  }
                                                  variant="ghost"
                                                  size="sm"
                                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                                                >
                                                  <Plus className="w-3 h-3 rotate-45" />
                                                </Button>
                                              )}
                                          </div>

                                          <div className="grid grid-cols-1 gap-2">
                                            <input
                                              type="text"
                                              value={thing.name}
                                              onChange={(e) =>
                                                updatePointThingToDo(
                                                  index,
                                                  thingIndex,
                                                  "name",
                                                  e.target.value
                                                )
                                              }
                                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                              placeholder="Name (required)"
                                            />
                                            <div>
                                              <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={(e) =>
                                                  handleThingImageSelect(
                                                    index,
                                                    thingIndex,
                                                    e
                                                  )
                                                }
                                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:cursor-pointer"
                                              />
                                              <p className="text-xs text-gray-400 mt-1">
                                                Max 5MB. JPEG, PNG, WebP
                                              </p>

                                              {thingsImageErrors[index]?.[
                                                thingIndex
                                              ] && (
                                                <p className="text-xs text-red-600 mt-1">
                                                  {
                                                    thingsImageErrors[index][
                                                      thingIndex
                                                    ]
                                                  }
                                                </p>
                                              )}

                                              {thingsImagePreviews[index]?.[
                                                thingIndex
                                              ] && (
                                                <div className="relative mt-2">
                                                  <img
                                                    src={
                                                      thingsImagePreviews[
                                                        index
                                                      ][thingIndex]!
                                                    }
                                                    alt={`Thing ${thingIndex + 1} Preview`}
                                                    className="w-full h-20 object-cover rounded-md border border-gray-300"
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      removeThingImage(
                                                        index,
                                                        thingIndex
                                                      )
                                                    }
                                                    className="absolute hover:cursor-pointer top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                  >
                                                    <PlusIcon className="w-3 h-3 rotate-45" />
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                            <textarea
                                              value={thing.description || ""}
                                              onChange={(e) =>
                                                updatePointThingToDo(
                                                  index,
                                                  thingIndex,
                                                  "description",
                                                  e.target.value
                                                )
                                              }
                                              rows={2}
                                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                              placeholder="Description"
                                            />
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                {/* Nearby Things To Do */}
                                <div className="mt-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-medium text-gray-600">
                                      Nearby Things To Do
                                    </label>
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        addPointNearbyThingToDo(index)
                                      }
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs text-purple-600 hover:text-purple-700"
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add Nearby
                                    </Button>
                                  </div>
                                  <div className="space-y-3">
                                    {point.nearbyThingsToDo?.map(
                                      (nearby, nearbyIndex) => (
                                        <div
                                          key={nearbyIndex}
                                          className="p-3 border border-gray-200 rounded-md bg-gray-50"
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-gray-600">
                                              Nearby Item {nearbyIndex + 1}
                                            </span>
                                            {point.nearbyThingsToDo &&
                                              point.nearbyThingsToDo.length >
                                                1 && (
                                                <Button
                                                  type="button"
                                                  onClick={() =>
                                                    removePointNearbyThingToDo(
                                                      index,
                                                      nearbyIndex
                                                    )
                                                  }
                                                  variant="ghost"
                                                  size="sm"
                                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                                                >
                                                  <Plus className="w-3 h-3 rotate-45" />
                                                </Button>
                                              )}
                                          </div>

                                          <div className="grid grid-cols-1 gap-2">
                                            <input
                                              type="text"
                                              value={nearby.name}
                                              onChange={(e) =>
                                                updatePointNearbyThingToDo(
                                                  index,
                                                  nearbyIndex,
                                                  "name",
                                                  e.target.value
                                                )
                                              }
                                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                              placeholder="Name (required)"
                                            />
                                            <div>
                                              <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={(e) =>
                                                  handleNearbyImageSelect(
                                                    index,
                                                    nearbyIndex,
                                                    e
                                                  )
                                                }
                                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:cursor-pointer"
                                              />
                                              <p className="text-xs text-gray-400 mt-1">
                                                Max 5MB. JPEG, PNG, WebP
                                              </p>

                                              {nearbyImageErrors[index]?.[
                                                nearbyIndex
                                              ] && (
                                                <p className="text-xs text-red-600 mt-1">
                                                  {
                                                    nearbyImageErrors[index][
                                                      nearbyIndex
                                                    ]
                                                  }
                                                </p>
                                              )}

                                              {nearbyImagePreviews[index]?.[
                                                nearbyIndex
                                              ] && (
                                                <div className="relative mt-2">
                                                  <img
                                                    src={
                                                      nearbyImagePreviews[
                                                        index
                                                      ][nearbyIndex]!
                                                    }
                                                    alt={`Nearby ${nearbyIndex + 1} Preview`}
                                                    className="w-full h-20 object-cover rounded-md border border-gray-300"
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      removeNearbyImage(
                                                        index,
                                                        nearbyIndex
                                                      )
                                                    }
                                                    className="absolute hover:cursor-pointer top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                  >
                                                    <PlusIcon className="w-3 h-3 rotate-45" />
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                            <textarea
                                              value={nearby.description || ""}
                                              onChange={(e) =>
                                                updatePointNearbyThingToDo(
                                                  index,
                                                  nearbyIndex,
                                                  "description",
                                                  e.target.value
                                                )
                                              }
                                              rows={2}
                                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                              placeholder="Description"
                                            />
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* End Point */}
                        <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-white">
                          <h5 className="text-sm font-semibold text-gray-800 mb-3">
                            End Point <span className="text-red-500">*</span>
                          </h5>

                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={itinerary.endPoint.name}
                              onChange={(e) =>
                                updateEndPoint("name", e.target.value)
                              }
                              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                experienceValidationErrors[
                                  "itinerary.endPoint.name"
                                ]
                                  ? "border-red-300"
                                  : "border-gray-300"
                              }`}
                              placeholder="Ending location name"
                            />
                          </div>

                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Description
                            </label>
                            <textarea
                              value={itinerary.endPoint.description}
                              onChange={(e) =>
                                updateEndPoint("description", e.target.value)
                              }
                              rows={2}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Describe the ending point"
                            />
                          </div>

                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Image
                            </label>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={handleEndPointImageSelect}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Max file size: 5MB. Supported formats: JPEG, PNG,
                              WebP
                            </p>

                            {endPointImageError && (
                              <p className="text-xs text-red-600 mt-1">
                                {endPointImageError}
                              </p>
                            )}

                            {endPointImagePreview && (
                              <div className="relative mt-3">
                                <img
                                  src={endPointImagePreview}
                                  alt="End Point Preview"
                                  className="w-full h-32 object-cover rounded-md border border-gray-300"
                                />
                                <button
                                  type="button"
                                  onClick={removeEndPointImage}
                                  className="absolute hover:cursor-pointer top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                  <PlusIcon className="w-4 h-4 rotate-45" />
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Address
                              </label>
                              <input
                                type="text"
                                value={
                                  itinerary.endPoint.location?.address || ""
                                }
                                onChange={(e) =>
                                  updateEndPointLocation(
                                    "address",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Full address"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Latitude
                              </label>
                              <input
                                type="number"
                                step="any"
                                value={
                                  itinerary.endPoint.location?.lat === 0
                                    ? ""
                                    : itinerary.endPoint.location?.lat
                                }
                                onChange={(e) =>
                                  updateEndPointLocation(
                                    "lat",
                                    e.target.value
                                      ? parseFloat(e.target.value)
                                      : 0
                                  )
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="40.7128"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Longitude
                              </label>
                              <input
                                type="number"
                                step="any"
                                value={
                                  itinerary.endPoint.location?.lng === 0
                                    ? ""
                                    : itinerary.endPoint.location?.lng
                                }
                                onChange={(e) =>
                                  updateEndPointLocation(
                                    "lng",
                                    e.target.value
                                      ? parseFloat(e.target.value)
                                      : 0
                                  )
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="-74.0060"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Itinerary validation errors */}
                        {experienceValidationErrors.itinerary && (
                          <p className="text-sm text-red-600 mt-2">
                            {experienceValidationErrors.itinerary}
                          </p>
                        )}
                      </div>
                    )}
                    {/* Content Fields Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-6">
                        Content Fields
                      </h3>

                      {/* Highlights */}
                      <div>
                        <WysiwygEditor
                          value={highlights}
                          onChange={setHighlights}
                          label="Highlights"
                          placeholder="Enter experience highlights..."
                          height={200}
                        />
                        {experienceValidationErrors["highlights"] && (
                          <p className="text-sm text-red-600 mt-1">
                            {experienceValidationErrors["highlights"]}
                          </p>
                        )}
                      </div>

                      {/* Inclusions */}
                      <div>
                        <WysiwygEditor
                          value={inclusions}
                          onChange={setInclusions}
                          label="Inclusions"
                          placeholder="What's included in this experience..."
                          height={200}
                        />
                        {experienceValidationErrors["inclusions"] && (
                          <p className="text-sm text-red-600 mt-1">
                            {experienceValidationErrors["inclusions"]}
                          </p>
                        )}
                      </div>

                      {/* Exclusions */}
                      <div>
                        <WysiwygEditor
                          value={exclusions}
                          onChange={setExclusions}
                          label="Exclusions"
                          placeholder="What's not included..."
                          height={200}
                        />
                        {experienceValidationErrors["exclusions"] && (
                          <p className="text-sm text-red-600 mt-1">
                            {experienceValidationErrors["exclusions"]}
                          </p>
                        )}
                      </div>

                      {/* Cancellation Policy */}
                      <div>
                        <WysiwygEditor
                          value={cancellationPolicy}
                          onChange={setCancellationPolicy}
                          label="Cancellation Policy"
                          placeholder="Enter cancellation policy details..."
                          height={200}
                        />
                        {experienceValidationErrors["cancellationPolicy"] && (
                          <p className="text-sm text-red-600 mt-1">
                            {experienceValidationErrors["cancellationPolicy"]}
                          </p>
                        )}
                      </div>

                      {/* Your Experience */}
                      <div>
                        <WysiwygEditor
                          value={youExperience}
                          onChange={setYouExperience}
                          label="Your Experience"
                          placeholder="Describe what visitors will experience..."
                          height={250}
                        />
                        {experienceValidationErrors["youExperience"] && (
                          <p className="text-sm text-red-600 mt-1">
                            {experienceValidationErrors["youExperience"]}
                          </p>
                        )}
                      </div>

                      {/* Know Before You Go */}
                      <div>
                        <WysiwygEditor
                          value={knowBeforeYouGo}
                          onChange={setKnowBeforeYouGo}
                          label="Know Before You Go"
                          placeholder="Important information for visitors..."
                          height={200}
                        />
                        {experienceValidationErrors["knowBeforeYouGo"] && (
                          <p className="text-sm text-red-600 mt-1">
                            {experienceValidationErrors["knowBeforeYouGo"]}
                          </p>
                        )}
                      </div>

                      {/* My Tickets */}
                      <div>
                        <WysiwygEditor
                          value={myTickets}
                          onChange={setMyTickets}
                          label="My Tickets"
                          placeholder="Ticket information and details..."
                          height={200}
                        />
                        {experienceValidationErrors["myTickets"] && (
                          <p className="text-sm text-red-600 mt-1">
                            {experienceValidationErrors["myTickets"]}
                          </p>
                        )}
                      </div>

                      {/* Explore More */}
                      <div>
                        <WysiwygEditor
                          value={exploreMore}
                          onChange={setExploreMore}
                          label="Explore More"
                          placeholder="Additional exploration opportunities..."
                          height={200}
                        />
                        {experienceValidationErrors["exploreMore"] && (
                          <p className="text-sm text-red-600 mt-1">
                            {experienceValidationErrors["exploreMore"]}
                          </p>
                        )}
                      </div>

                      {/* Blog Slugs */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Blog Slugs
                        </label>
                        <div className="space-y-3">
                          {/* Input for adding new slug */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newSlug}
                              onChange={(e) => setNewSlug(e.target.value)}
                              onKeyPress={handleSlugKeyPress}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Add blog slug..."
                            />
                            <button
                              type="button"
                              onClick={addBlogSlug}
                              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                            >
                              Add
                            </button>
                          </div>

                          {/* Display existing slugs */}
                          {blogSlugs.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {blogSlugs.map((slug, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-300 rounded-full"
                                >
                                  <span className="text-sm">{slug}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeBlogSlug(index)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                    title="Remove slug"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <p className="text-xs text-gray-500">
                            Press Enter or click Add to add a slug. Click × to remove.
                          </p>
                        </div>
                        {experienceValidationErrors["blogSlugs"] && (
                          <p className="text-sm text-red-600 mt-1">
                            {experienceValidationErrors["blogSlugs"]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Images Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Experience Images
                  </h3>

                  {/* Main Images */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Images <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleMainImagesSelect}
                      className="w-full px-3 hover:cursor-pointer py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max file size: 5MB per image. Supported formats: JPEG,
                      PNG, WebP
                    </p>

                    {experienceValidationErrors.mainImages && (
                      <p className="text-sm text-red-600 mt-1">
                        {experienceValidationErrors.mainImages}
                      </p>
                    )}

                    {/* Main Images Preview */}
                    {mainImagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {mainImagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Main image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-md border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, true)}
                              className="absolute hover:cursor-pointer top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                            >
                              <PlusIcon className="w-4 h-4 rotate-45" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Other Images */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Other Images <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImagesSelect}
                      className="w-full hover:cursor-pointer px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max file size: 5MB per image. Supported formats: JPEG,
                      PNG, WebP
                    </p>

                    {experienceValidationErrors.images && (
                      <p className="text-sm text-red-600 mt-1">
                        {experienceValidationErrors.images}
                      </p>
                    )}

                    {/* Other Images Preview */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-md border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, false)}
                              className="absolute hover:cursor-pointer top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                            >
                              <PlusIcon className="w-4 h-4 rotate-45" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New City Modal */}
      {showNewCityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Create New City
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    validationErrors.cityName
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter city name"
                />
                {validationErrors.cityName && (
                  <p className="text-sm text-red-600 mt-1">
                    {validationErrors.cityName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCityCountry}
                  onChange={(e) => setNewCityCountry(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    validationErrors.countryName
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter country name"
                />
                {validationErrors.countryName && (
                  <p className="text-sm text-red-600 mt-1">
                    {validationErrors.countryName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City Image <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageSelect}
                    className={`w-full hover:cursor-pointer px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      validationErrors.image
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  <p className="text-xs text-gray-500">
                    Max file size: 5MB. Supported formats: JPEG, PNG, WebP
                  </p>

                  {(imageError || validationErrors.image) && (
                    <p className="text-sm text-red-600">
                      {imageError || validationErrors.image}
                    </p>
                  )}

                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute hover:cursor-pointer top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        <PlusIcon className="w-4 h-4 rotate-45" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <Button
                onClick={handleSaveNewCity}
                disabled={isCreatingCity}
                className="bg-purple-600 hover:cursor-pointer hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingCity ? "Creating..." : "Create City"}
              </Button>
              <Button
                variant="outline"
                className="hover:cursor-pointer"
                onClick={handleCancelNewCity}
                disabled={isCreatingCity}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Subcategory Modal */}
      {showNewSubcategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Create New Subcategory
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    subcategoryValidationErrors.subcategoryName
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter subcategory name"
                />
                {subcategoryValidationErrors.subcategoryName && (
                  <p className="text-sm text-red-600 mt-1">
                    {subcategoryValidationErrors.subcategoryName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <Button
                onClick={handleSaveNewSubcategory}
                disabled={isCreatingSubcategory}
                className="bg-purple-600 hover:cursor-pointer hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingSubcategory ? "Creating..." : "Create Subcategory"}
              </Button>
              <Button
                variant="outline"
                className="hover:cursor-pointer"
                onClick={handleCancelNewSubcategory}
                disabled={isCreatingSubcategory}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewExperience;
