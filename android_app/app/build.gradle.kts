plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.example.android_app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.android_app"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    //implementation("com.squareup.okhttp3:okhttp:4.9.3")
    implementation(libs.okhttp3.okhttp)

    //implementation("com.google.code.gson:gson:2.10.1")
    implementation(libs.google.gson)

    //implementation("androidx.lifecycle:lifecycle-viewmodel:2.8.7")
    implementation(libs.lifecycle.viewmodel)

    //implementation("androidx.lifecycle:lifecycle-livedata:2.8.7")
    implementation(libs.lifecycle.livedata)

    //implementation("androidx.room:room-runtime:2.6.1")
    implementation(libs.room.runtime)

    implementation(libs.androidx.recyclerview.v132)
    implementation(libs.androidx.lifecycle.livedata.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.ktx)
    implementation(libs.androidx.navigation.fragment)
    implementation(libs.androidx.navigation.ui)
    //implementation("androidx.recyclerview:recyclerview:1.3.2")

    //annotationProcessor("androidx.room:room-compiler:2.6.1")
    annotationProcessor(libs.room.compiler)

    //implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation(libs.retrofit)

    //implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation(libs.converter.gson)

    implementation("com.github.bumptech.glide:glide:4.15.1")
    //implementation(libs.com.github.bumptech.glide.glide)

    annotationProcessor("com.github.bumptech.glide:compiler:4.15.1")
    //annotationProcessor(libs.github.compiler)


    implementation("androidx.navigation:navigation-fragment-ktx:2.7.6")
    implementation("androidx.navigation:navigation-ui-ktx:2.7.6")

    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}