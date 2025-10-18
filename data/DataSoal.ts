export const DataSoal : Section[] = [
  {
    "id": "reading",
    "name": "Qira'ah",
    "type": "Qira'ah",
    "instructions": "Bagian Qira'ah akan menguji kemampuan Anda memahami teks akademik dalam Bahasa Arab. Bacalah setiap teks dengan cermat dan jawab pertanyaan berdasarkan informasi yang diberikan.",
    "groups": [
      {
        "passage": "هَذَا بَيْتِي. بَيْتِي كَبِيرٌ وَجَمِيلٌ. لَهُ أَرْبَعُ غُرَفٍ. غُرْفَةُ النَّوْمِ، وَغُرْفَةُ الْمَعِيشَةِ، وَالْمَطْبَخُ، وَالْحَمَّامُ. أَنَا أُحِبُّ بَيْتِي كَثِيرًا.",
        "questions": [
          {
            "id": "R1",
            "type": "Qira'ah",
            "question": "كم عدد الغرف في البيت؟",
            "options": ["ثلاث غرف", "أربع غرف", "خمس غرف", "غرفتان"],
            "correctAnswer": "أربع غرف",
            "userAnswer": null
          },
          {
            "id": "R2",
            "type": "Qira'ah",
            "question": "هل البيت صغير أم كبير؟",
            "options": ["صغير", "كبير", "متوسط", "غير معروف"],
            "correctAnswer": "كبير",
            "userAnswer": null
          },
          {
            "id": "R3",
            "type": "Qira'ah",
            "question": "ماذا توجد في البيت غير غرفة النوم وغرفة المعيشة؟",
            "options": ["الحديقة", "السيارة", "المطبخ والحمام", "المكتبة"],
            "correctAnswer": "المطبخ والحمام",
            "userAnswer": null
          },
          {
            "id": "R4",
            "type": "Qira'ah",
            "question": "هل المتحدث يحب بيته؟",
            "options": ["نعم", "لا", "ربما", "غير مهتم"],
            "correctAnswer": "نعم",
            "userAnswer": null
          },
          {
            "id": "R5",
            "type": "Qira'ah",
            "question": "ما هي صفة البيت المذكورة في النص؟",
            "options": ["قبيح", "جديد", "جميل", "قديم"],
            "correctAnswer": "جميل",
            "userAnswer": null
          }
        ]
      },
      {
        "passage": "اسْمِي لَيْلَى. أَنَا طَبِيبَةٌ. أَعْمَلُ فِي الْمُسْتَشْفَى كُلَّ يَوْمٍ. أُسَاعِدُ النَّاسَ الْمَرْضَى. عَمَلِي مُهِمٌّ جِدًّا.",
        "questions": [
          {
            "id": "R6",
            "type": "Qira'ah",
            "question": "ما هي مهنة ليلى؟",
            "options": ["معلمة", "طبيبة", "مهندسة", "طالبة"],
            "correctAnswer": "طبيبة",
            "userAnswer": null
          },
          {
            "id": "R7",
            "type": "Qira'ah",
            "question": "أين تعمل ليلى؟",
            "options": ["في المدرسة", "في السوق", "في المستشفى", "في البيت"],
            "correctAnswer": "في المستشفى",
            "userAnswer": null
          },
          {
            "id": "R8",
            "type": "Qira'ah",
            "question": "من تساعد ليلى في عملها؟",
            "options": ["الأطفال", "الطلاب", "الناس المرضى", "الأصدقاء"],
            "correctAnswer": "الناس المرضى",
            "userAnswer": null
          },
          {
            "id": "R9",
            "type": "Qira'ah",
            "question": "كم مرة تعمل ليلى في المستشفى؟",
            "options": ["مرة في الأسبوع", "مرتين في الأسبوع", "كل يوم", "مرة في الشهر"],
            "correctAnswer": "كل يوم",
            "userAnswer": null
          },
          {
            "id": "R10",
            "type": "Qira'ah",
            "question": "هل عمل ليلى مهم؟",
            "options": ["لا", "قليلًا", "مهم جدًا", "غير مهم"],
            "correctAnswer": "مهم جدًا",
            "userAnswer": null
          }
        ]
      }
    ]
  },
  {
    "id": "listening",
    "name": "Istima'",
    "type": "Istima'",
    "instructions": "Bagian Istima' akan menguji kemampuan Anda memahami percakapan dan instruksi dalam Bahasa Arab. Dengarkan setiap rekaman audio dengan seksama dan jawab pertanyaan berdasarkan apa yang Anda dengar.",
    "audioInstructions": "Simulasi audio tidak dapat diputar langsung di sini. Instruksi ini berlaku untuk file audio terpisah.",
    "groups": [
      {
        "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "passage": "Dengarkan audio ini dan jawab pertanyaan di bawahnya.",
        "questions": [
          {
            "id": "L1",
            "type": "Istima'",
            "question": "ماذا قال المتحدث في البداية؟",
            "options": ["مساء الخير", "صباح الخير", "تصبح على خير", "أهلاً وسهلاً"],
            "correctAnswer": "صباح الخير",
            "userAnswer": null
          },
          {
            "id": "L2",
            "type": "Istima'",
            "question": "ماذا عرض المتحدث؟",
            "options": ["أن يذهب", "أن يأكل", "أن يساعد", "أن ينام"],
            "correctAnswer": "أن يساعد",
            "userAnswer": null
          }
        ]
      },
      {
        "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        "passage": "Dengarkan percakapan ini dan jawab pertanyaan.",
        "questions": [
          {
            "id": "L3",
            "type": "Istima'",
            "question": "أين يذهب المتحدث؟",
            "options": ["إلى المدرسة", "إلى البيت", "إلى السوق", "إلى العمل"],
            "correctAnswer": "إلى السوق",
            "userAnswer": null
          },
          {
            "id": "L4",
            "type": "Istima'",
            "question": "ماذا يريد المتحدث أن يشتري؟",
            "options": ["ملابس وأحذية", "كتب وأقلام", "فواكه وخضروات", "ألعاب"],
            "correctAnswer": "فواكه وخضروات",
            "userAnswer": null
          },
          {
            "id": "L5",
            "type": "Istima'",
            "question": "ما نوع الأشياء التي يشتريها المتحدث؟",
            "options": ["إلكترونيات", "طعام", "أدوات", "أثاث"],
            "correctAnswer": "طعام",
            "userAnswer": null
          }
        ]
      },
      {
        "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        "passage": "Dengarkan pengumuman ini dan jawab pertanyaan.",
        "questions": [
          {
            "id": "L6",
            "type": "Istima'",
            "question": "كيف هو الجو اليوم؟",
            "options": ["ممطر", "غائم", "جميل", "بارد"],
            "correctAnswer": "جميل",
            "userAnswer": null
          },
          {
            "id": "L7",
            "type": "Istima'",
            "question": "هل توجد شمس اليوم؟",
            "options": ["نعم، ساطعة", "لا، غائمة", "قليلًا", "غير معروف"],
            "correctAnswer": "نعم، ساطعة",
            "userAnswer": null
          },
          {
            "id": "L8",
            "type": "Istima'",
            "question": "هل يوجد مطر اليوم؟",
            "options": ["نعم، كثير", "نعم، قليل", "لا", "غير معروف"],
            "correctAnswer": "لا",
            "userAnswer": null
          },
          {
            "id": "L9",
            "type": "Istima'",
            "question": "ماذا تعني كلمة 'ساطعة'؟",
            "options": ["خفيفة", "مظلمة", "مشرقة", "باردة"],
            "correctAnswer": "مشرقة",
            "userAnswer": null
          },
          {
            "id": "L10",
            "type": "Istima'",
            "question": "متى يدور هذا الحديث؟",
            "options": ["في الليل", "في الصباح", "في أي وقت", "عند الغروب"],
            "correctAnswer": "في الصباح",
            "userAnswer": null
          }
        ]
      }
    ]
  },
  {
    "id": "struktur-grammer",
    "name": "Qawa'id",
    "type": "Qawa'id",
    "instructions": "Bagian Qawa'id akan menguji pemahaman Anda tentang tata bahasa Arab. Pilih jawaban yang paling tepat untuk melengkapi kalimat atau memperbaiki kesalahan.",
    "groups": [
      {
        "passage": "Pilih jawaban yang paling tepat untuk melengkapi kalimat.",
        "questions": [
          {
            "id": "G1",
            "type": "Qawa'id",
            "question": "هَذَا _____. (This is _____. (maskulin))",
            "options": ["طَالِبَةٌ (student (feminin))", "سَيَّارَةٌ (car)", "كِتَابٌ (book)", "مَدْرَسَةٌ (school)"],
            "correctAnswer": "كِتَابٌ (book)",
            "userAnswer": null
          },
          {
            "id": "G2",
            "type": "Qawa'id",
            "question": "هَذِهِ _____. (This is _____. (feminin))",
            "options": ["قَلَمٌ (pen (maskulin))", "كُرْسِيٌّ (chair (maskulin))", "طَاوِلَةٌ (table (feminin))", "بَيْتٌ (house (maskulin))"],
            "correctAnswer": "طَاوِلَةٌ (table (feminin))",
            "userAnswer": null
          },
          {
            "id": "G3",
            "type": "Qawa'id",
            "question": "أَنَا _____ إِلَى الْمَطْعَمِ. (I go to the restaurant.)",
            "options": ["يَذْهَبُ (he goes)", "تَذْهَبُ (she goes)", "أَذْهَبُ (I go)", "نَذْهَبُ (we go)"],
            "correctAnswer": "أَذْهَبُ (I go)",
            "userAnswer": null
          },
          {
            "id": "G4",
            "type": "Qawa'id",
            "question": "هُوَ _____. (He is _____.)",
            "options": ["طَالِبَةٌ (student (feminin))", "طَبِيبٌ (doctor (maskulin))", "مُعَلِّمَةٌ (teacher (feminin))", "مُهَنْدِسَةٌ (engineer (feminin))"],
            "correctAnswer": "طَبِيبٌ (doctor (maskulin))",
            "userAnswer": null
          },
          {
            "id": "G5",
            "type": "Qawa'id",
            "question": "هِيَ _____. (She is _____.)",
            "options": ["مُهَنْدِسٌ (engineer (maskulin))", "مُدَرِّسٌ (teacher (maskulin))", "طَالِبٌ (student (maskulin))", "طَبِيبَةٌ (doctor (feminin))"],
            "correctAnswer": "طَبِيبَةٌ (doctor (feminin))",
            "userAnswer": null
          }
        ]
      },
      {
        "passage": "Pilih kalimat yang benar secara tata bahasa.",
        "questions": [
          {
            "id": "G6",
            "type": "Qawa'id",
            "question": "Pilih kalimat yang benar secara tata bahasa.",
            "options": ["أَنْتِ تَدْرُسُ. (You (feminin) study (maskulin verb).)", "أَنْتِ تَدْرُسِينَ. (You (feminin) study (feminin verb).)", "أَنْتَ تَدْرُسِينَ. (You (maskulin) study (feminin verb).)", "أَنْتَ تَدْرُسُون. (You (maskulin plural) study.)"],
            "correctAnswer": "أَنْتِ تَدْرُسِينَ. (You (feminin) study (feminin verb).)",
            "userAnswer": null
          },
          {
            "id": "G7",
            "type": "Qawa'id",
            "question": "Pilih kalimat yang benar secara tata bahasa.",
            "options": ["هُمْ جَالِسُونَ. (They (maskulin) are sitting.)", "هُمْ جَالِسَاتٌ. (They (feminin) are sitting.)", "هُنَّ جَالِسُونَ. (They (feminin) are sitting (maskulin plural).)", "هُنَّ جَالِسَاتٌ. (They (feminin) are sitting (feminin plural).)", "هُمْ جَالِسٌ. (They (maskulin) are sitting (singular).)", "هُنَّ جَالِسَةٌ. (They (feminin) are sitting (singular).)", "هما جَالِسٌ. (They (dual) are sitting (singular).)", "هما جَالِسَةٌ. (They (dual) are sitting (singular).)", "هما جَالِسَانِ. (They (dual maskulin) are sitting (dual).)", "هما جَالِسَتَانِ. (They (dual feminin) are sitting (dual).)"],
            "correctAnswer": "هُمْ جَالِسُونَ. (They (maskulin) are sitting.)",
            "userAnswer": null
          },
          {
            "id": "G8",
            "type": "Qawa'id",
            "question": "Pilih kalimat yang benar secara tata bahasa.",
            "options": ["فِي الْصَّفِ كِتَابٌ. (In the class is a book.)", "فِي الْصَّفِ كِتَابٌ عَلَى الطَّاوِلَةِ. (In the class is a book on the table.)", "الْكِتَابُ فِي الْصَّفِ. (The book is in the class.)", "الْكِتَابُ عَلَى الطَّاوِلَةِ فِي الْصَّفِ. (The book is on the table in the class.)"],
            "correctAnswer": "الْكِتَابُ عَلَى الطَّاوِلَةِ فِي الْصَّفِ. (The book is on the table in the class.)",
            "userAnswer": null
          },
          {
            "id": "G9",
            "type": "Qawa'id",
            "question": "Pilih kalimat yang benar secara tata bahasa.",
            "options": ["كَمْ طَالِبٌ فِي الْفَصْلِ؟ (How many student (maskulin singular) in the class?)", "كَمْ طَالِبًا فِي الْفَصْلِ؟ (How many student (accusative singular) in the class?)", "كَمْ طُلَّابٌ فِي الْفَصْلِ؟ (How many students (plural) in the class?)", "كَمْ طَالِبَةٌ فِي الْفَصْلِ؟ (How many student (feminin singular) in the class?)"],
            "correctAnswer": "كَمْ طَالِبًا فِي الْفَصْلِ؟ (How many student (accusative singular) in the class?)",
            "userAnswer": null
          },
          {
            "id": "G10",
            "type": "Qawa'id",
            "question": "Pilih kalimat yang benar secara tata bahasa.",
            "options": ["ذَهَبْتُ إِلَى الْمَكْتَبَةِ أَمْسِ. (I went to the library yesterday.)", "أَذْهَبُ إِلَى الْمَكْتَبَةِ أَمْسِ. (I go to the library yesterday.)", "سَأَذْهَبُ إِلَى الْمَكْتَبَةِ أَمْسِ. (I will go to the library yesterday.)", "نَذْهَبُ إِلَى الْمَكْتَبَةِ أَمْسِ. (We go to the library yesterday.)"],
            "correctAnswer": "ذَهَبْتُ إِلَى الْمَكْتَبَةِ أَمْسِ. (I went to the library yesterday.)",
            "userAnswer": null
          }
        ]
      }
    ]
  }
]