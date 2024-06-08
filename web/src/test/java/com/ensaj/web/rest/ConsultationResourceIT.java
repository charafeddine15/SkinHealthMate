package com.ensaj.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ensaj.IntegrationTest;
import com.ensaj.domain.Consultation;
import com.ensaj.repository.ConsultationRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link ConsultationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConsultationResourceIT {

    private static final Instant DEFAULT_DATE_CONSULTATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_CONSULTATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/consultations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private MockMvc restConsultationMockMvc;

    private Consultation consultation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consultation createEntity() {
        Consultation consultation = new Consultation().dateConsultation(DEFAULT_DATE_CONSULTATION);
        return consultation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consultation createUpdatedEntity() {
        Consultation consultation = new Consultation().dateConsultation(UPDATED_DATE_CONSULTATION);
        return consultation;
    }

    @BeforeEach
    public void initTest() {
        consultationRepository.deleteAll();
        consultation = createEntity();
    }

    @Test
    void createConsultation() throws Exception {
        int databaseSizeBeforeCreate = consultationRepository.findAll().size();
        // Create the Consultation
        restConsultationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consultation)))
            .andExpect(status().isCreated());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeCreate + 1);
        Consultation testConsultation = consultationList.get(consultationList.size() - 1);
        assertThat(testConsultation.getDateConsultation()).isEqualTo(DEFAULT_DATE_CONSULTATION);
    }

    @Test
    void createConsultationWithExistingId() throws Exception {
        // Create the Consultation with an existing ID
        consultation.setId("existing_id");

        int databaseSizeBeforeCreate = consultationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConsultationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consultation)))
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllConsultations() throws Exception {
        // Initialize the database
        consultationRepository.save(consultation);

        // Get all the consultationList
        restConsultationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(consultation.getId())))
            .andExpect(jsonPath("$.[*].dateConsultation").value(hasItem(DEFAULT_DATE_CONSULTATION.toString())));
    }

    @Test
    void getConsultation() throws Exception {
        // Initialize the database
        consultationRepository.save(consultation);

        // Get the consultation
        restConsultationMockMvc
            .perform(get(ENTITY_API_URL_ID, consultation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(consultation.getId()))
            .andExpect(jsonPath("$.dateConsultation").value(DEFAULT_DATE_CONSULTATION.toString()));
    }

    @Test
    void getNonExistingConsultation() throws Exception {
        // Get the consultation
        restConsultationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingConsultation() throws Exception {
        // Initialize the database
        consultationRepository.save(consultation);

        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();

        // Update the consultation
        Consultation updatedConsultation = consultationRepository.findById(consultation.getId()).orElseThrow();
        updatedConsultation.dateConsultation(UPDATED_DATE_CONSULTATION);

        restConsultationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConsultation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConsultation))
            )
            .andExpect(status().isOk());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
        Consultation testConsultation = consultationList.get(consultationList.size() - 1);
        assertThat(testConsultation.getDateConsultation()).isEqualTo(UPDATED_DATE_CONSULTATION);
    }

    @Test
    void putNonExistingConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, consultation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consultation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateConsultationWithPatch() throws Exception {
        // Initialize the database
        consultationRepository.save(consultation);

        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();

        // Update the consultation using partial update
        Consultation partialUpdatedConsultation = new Consultation();
        partialUpdatedConsultation.setId(consultation.getId());

        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsultation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsultation))
            )
            .andExpect(status().isOk());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
        Consultation testConsultation = consultationList.get(consultationList.size() - 1);
        assertThat(testConsultation.getDateConsultation()).isEqualTo(DEFAULT_DATE_CONSULTATION);
    }

    @Test
    void fullUpdateConsultationWithPatch() throws Exception {
        // Initialize the database
        consultationRepository.save(consultation);

        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();

        // Update the consultation using partial update
        Consultation partialUpdatedConsultation = new Consultation();
        partialUpdatedConsultation.setId(consultation.getId());

        partialUpdatedConsultation.dateConsultation(UPDATED_DATE_CONSULTATION);

        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsultation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsultation))
            )
            .andExpect(status().isOk());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
        Consultation testConsultation = consultationList.get(consultationList.size() - 1);
        assertThat(testConsultation.getDateConsultation()).isEqualTo(UPDATED_DATE_CONSULTATION);
    }

    @Test
    void patchNonExistingConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, consultation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteConsultation() throws Exception {
        // Initialize the database
        consultationRepository.save(consultation);

        int databaseSizeBeforeDelete = consultationRepository.findAll().size();

        // Delete the consultation
        restConsultationMockMvc
            .perform(delete(ENTITY_API_URL_ID, consultation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
